/**
 * Dagger Deployment Pipeline
 *
 * This pipeline handles building and deploying to Vercel.
 */

import { connect, Client, Container } from '@dagger.io/dagger'

/**
 * Build a Node.js container with dependencies installed
 */
async function buildNodeContainer(client: Client): Promise<Container> {
  const source = client
    .host()
    .directory('.', {
      exclude: [
        'node_modules',
        'dist',
        'coverage',
        '.git',
        'dagger',
      ],
    })

  return client
    .container()
    .from('node:20-alpine')
    .withDirectory('/app', source)
    .withWorkdir('/app')
    .withExec(['npm', 'ci'])
}

/**
 * Build the project for production
 */
async function buildProject(container: Container): Promise<Container> {
  console.log('🏗️  Building project for production...')

  const built = container.withExec(['npm', 'run', 'build'])

  // Verify build succeeded
  const distExists = await built
    .directory('/app/dist')
    .entries()
    .then(entries => entries.length > 0)

  if (!distExists) {
    throw new Error('Build failed: dist directory not created')
  }

  console.log('✅ Build successful')
  return built
}

/**
 * Deploy to Vercel using the Vercel CLI
 */
async function deployToVercel(
  container: Container,
  vercelToken: string,
  vercelOrgId: string,
  vercelProjectId: string,
  production: boolean = true
): Promise<string> {
  console.log(`🚀 Deploying to Vercel (${production ? 'production' : 'preview'})...`)

  // Install Vercel CLI globally
  const withVercel = container
    .withExec(['npm', 'install', '-g', 'vercel'])

  // Set Vercel environment variables
  const withEnv = withVercel
    .withEnvVariable('VERCEL_TOKEN', vercelToken)
    .withEnvVariable('VERCEL_ORG_ID', vercelOrgId)
    .withEnvVariable('VERCEL_PROJECT_ID', vercelProjectId)

  // Deploy with Vercel CLI
  const args = ['vercel', 'deploy', '--yes']
  if (production) {
    args.push('--prod')
  }

  const deployOutput = await withEnv.withExec(args).stdout()

  // Extract deployment URL from output
  const deploymentUrl = deployOutput.trim().split('\n').pop() || 'Unknown'

  console.log(`✅ Deployment successful: ${deploymentUrl}`)
  return deploymentUrl
}

/**
 * Main deployment pipeline
 */
async function main() {
  console.log('🚀 Starting Dagger Deployment Pipeline\n')

  // Validate required environment variables
  const vercelToken = process.env.VERCEL_TOKEN
  const vercelOrgId = process.env.VERCEL_ORG_ID
  const vercelProjectId = process.env.VERCEL_PROJECT_ID

  if (!vercelToken || !vercelOrgId || !vercelProjectId) {
    throw new Error(
      'Missing required environment variables: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID'
    )
  }

  const startTime = Date.now()
  const isProduction = process.env.VERCEL_ENV === 'production'

  await connect(
    async (client) => {
      // Build base container with dependencies
      const container = await buildNodeContainer(client)

      // Build the project
      const built = await buildProject(container)

      // Deploy to Vercel
      const deploymentUrl = await deployToVercel(
        built,
        vercelToken,
        vercelOrgId,
        vercelProjectId,
        isProduction
      )

      const duration = ((Date.now() - startTime) / 1000).toFixed(2)
      const branch = process.env.GITHUB_REF_NAME || 'local'
      const commit = process.env.GITHUB_SHA || 'unknown'

      console.log('\n✅ Deployment complete!')
      console.log(`\n📊 Summary:`)
      console.log(`   - Environment: ${isProduction ? 'Production' : 'Preview'}`)
      console.log(`   - Branch: ${branch}`)
      console.log(`   - Commit: ${commit.substring(0, 7)}`)
      console.log(`   - URL: ${deploymentUrl}`)
      console.log(`   - Duration: ${duration}s`)
    },
    { LogOutput: process.stderr }
  )
}

// Run the pipeline
main().catch((error) => {
  console.error('❌ Deployment failed:', error.message)
  process.exit(1)
})
