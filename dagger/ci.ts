/**
 * Dagger CI Pipeline
 *
 * This pipeline replaces the GitHub Actions CI workflow with a unified,
 * portable pipeline that can run locally or in CI.
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
 * Run TypeScript type checking
 */
async function typeCheck(container: Container): Promise<string> {
  console.log('🔍 Running TypeScript type check...')

  const result = await container
    .withExec(['npx', 'tsc', '--noEmit'])
    .stdout()

  console.log('✅ Type check passed')
  return result
}

/**
 * Run tests with coverage
 */
async function runTests(container: Container): Promise<string> {
  console.log('🧪 Running tests with coverage...')

  const result = await container
    .withExec(['npm', 'test', '--', '--coverage', '--run'])
    .stdout()

  console.log('✅ Tests passed')
  return result
}

/**
 * Build the project
 */
async function build(container: Container): Promise<{ output: string; dist: Container }> {
  console.log('🏗️  Building project...')

  const built = container.withExec(['npm', 'run', 'build'])

  const output = await built.stdout()

  // Check that dist directory exists
  const distExists = await built
    .directory('/app/dist')
    .entries()
    .then(entries => entries.length > 0)

  if (!distExists) {
    throw new Error('Build failed: dist directory not created')
  }

  console.log('✅ Build successful')
  return { output, dist: built }
}

/**
 * Get bundle size information
 */
async function getBundleSize(container: Container): Promise<string> {
  console.log('📦 Calculating bundle size...')

  const size = await container
    .withExec(['sh', '-c', 'du -sh dist | cut -f1'])
    .stdout()

  console.log(`Bundle size: ${size.trim()}`)
  return size.trim()
}

/**
 * Export coverage artifacts
 */
async function exportCoverage(container: Container, outputPath: string): Promise<void> {
  console.log('📊 Exporting coverage report...')

  const coverage = container.directory('/app/coverage')

  await coverage.export(outputPath)

  console.log(`✅ Coverage exported to ${outputPath}`)
}

/**
 * Export build artifacts
 */
async function exportBuild(container: Container, outputPath: string): Promise<void> {
  console.log('📦 Exporting build artifacts...')

  const dist = container.directory('/app/dist')

  await dist.export(outputPath)

  console.log(`✅ Build artifacts exported to ${outputPath}`)
}

/**
 * Main CI pipeline
 */
async function main() {
  console.log('🚀 Starting Dagger CI Pipeline\n')

  const startTime = Date.now()

  await connect(
    async (client) => {
      // Build base container with dependencies
      const container = await buildNodeContainer(client)

      // Run all checks in parallel
      const [typeCheckResult, testResult, buildResult] = await Promise.all([
        typeCheck(container),
        runTests(container),
        build(container),
      ])

      // Get bundle size
      const bundleSize = await getBundleSize(buildResult.dist)

      // Export artifacts if running in CI
      if (process.env.CI) {
        await Promise.all([
          exportCoverage(container.withExec(['npm', 'test', '--', '--coverage', '--run']), './coverage'),
          exportBuild(buildResult.dist, './dist'),
        ])
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2)

      console.log('\n✅ All CI checks passed!')
      console.log(`\n📊 Summary:`)
      console.log(`   - Type check: ✅`)
      console.log(`   - Tests: ✅`)
      console.log(`   - Build: ✅`)
      console.log(`   - Bundle size: ${bundleSize}`)
      console.log(`   - Duration: ${duration}s`)
    },
    { LogOutput: process.stderr }
  )
}

// Run the pipeline
main().catch((error) => {
  console.error('❌ Pipeline failed:', error.message)
  process.exit(1)
})
