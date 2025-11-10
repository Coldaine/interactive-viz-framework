import { describe, it, expect } from 'vitest'
import { Node, Edge } from '@xyflow/react'
import { isValidConnection, getConnectionValidationMessage } from './connectionValidation'

describe('connectionValidation', () => {
  const mockNodes: Node[] = [
    { id: '1', position: { x: 0, y: 0 }, data: {}, type: 'dataNode' },
    { id: '2', position: { x: 100, y: 100 }, data: {}, type: 'actionNode' },
    { id: '3', position: { x: 200, y: 200 }, data: {}, type: 'decisionNode' },
    { id: '4', position: { x: 300, y: 300 }, data: {}, type: 'mediaNode' },
    { id: '5', position: { x: 400, y: 400 }, data: {}, type: 'integrationNode' },
  ]

  const mockEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
  ]

  describe('isValidConnection', () => {
    it('should allow valid connection between compatible types', () => {
      // Connection from node 1 to node 4 (not in mockEdges)
      const connection = {
        source: '1',
        target: '4',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(isValidConnection(connection, mockEdges, mockNodes)).toBe(true)
    })

    it('should prevent self-connections', () => {
      const connection = {
        source: '1',
        target: '1',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(isValidConnection(connection, mockEdges, mockNodes)).toBe(false)
    })

    it('should prevent duplicate connections', () => {
      const connection = {
        source: '1',
        target: '2',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(isValidConnection(connection, mockEdges, mockNodes)).toBe(false)
    })

    it('should enforce type compatibility rules', () => {
      // DecisionNode can connect to ActionNode (allowed)
      const validConnection = {
        source: '3',
        target: '2',
        sourceHandle: null,
        targetHandle: null,
      }
      expect(isValidConnection(validConnection, mockEdges, mockNodes)).toBe(true)

      // DecisionNode cannot connect to MediaNode (not allowed)
      const invalidConnection = {
        source: '3',
        target: '4',
        sourceHandle: null,
        targetHandle: null,
      }
      expect(isValidConnection(invalidConnection, mockEdges, mockNodes)).toBe(false)
    })

    it('should prevent connections with missing nodes', () => {
      const connection = {
        source: '999',
        target: '2',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(isValidConnection(connection, mockEdges, mockNodes)).toBe(false)
    })

    it('should enforce maximum outgoing connections limit', () => {
      // Create edges with 5 outgoing connections from node 1
      const edgesWithMaxConnections: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e1-3', source: '1', target: '3' },
        { id: 'e1-4', source: '1', target: '4' },
        { id: 'e1-5', source: '1', target: '5' },
        { id: 'e1-6', source: '1', target: '2' }, // 5th connection (different handle)
      ]

      const connection = {
        source: '1',
        target: '4',
        sourceHandle: 'bottom',
        targetHandle: null,
      }

      expect(
        isValidConnection(connection, edgesWithMaxConnections, mockNodes)
      ).toBe(false)
    })

    it('should allow connections under the maximum limit', () => {
      const connection = {
        source: '5',
        target: '1',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(isValidConnection(connection, mockEdges, mockNodes)).toBe(true)
    })

    it('should handle nodes with undefined type as default', () => {
      const nodesWithDefaultType: Node[] = [
        { id: '1', position: { x: 0, y: 0 }, data: {} }, // No type specified
        { id: '2', position: { x: 100, y: 100 }, data: {}, type: 'actionNode' },
      ]

      const connection = {
        source: '1',
        target: '2',
        sourceHandle: null,
        targetHandle: null,
      }

      // Should return true because undefined types are allowed (permissive mode)
      // This allows flexibility for custom node types not in compatibility rules
      expect(
        isValidConnection(connection, [], nodesWithDefaultType)
      ).toBe(true)
    })
  })

  describe('getConnectionValidationMessage', () => {
    it('should return message for self-connection', () => {
      const connection = {
        source: '1',
        target: '1',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(getConnectionValidationMessage(connection, mockEdges, mockNodes)).toBe(
        'Cannot connect a node to itself'
      )
    })

    it('should return message for duplicate connection', () => {
      const connection = {
        source: '1',
        target: '2',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(getConnectionValidationMessage(connection, mockEdges, mockNodes)).toBe(
        'This connection already exists'
      )
    })

    it('should return message for type incompatibility', () => {
      const connection = {
        source: '3',
        target: '4',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(getConnectionValidationMessage(connection, mockEdges, mockNodes)).toBe(
        'decisionNode cannot connect to mediaNode'
      )
    })

    it('should return message for missing nodes', () => {
      const connection = {
        source: '999',
        target: '2',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(getConnectionValidationMessage(connection, mockEdges, mockNodes)).toBe(
        'Source or target node not found'
      )
    })

    it('should return message for maximum connections reached', () => {
      const edgesWithMaxConnections: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e1-3a', source: '1', target: '3', sourceHandle: 'a' },
        { id: 'e1-3b', source: '1', target: '3', sourceHandle: 'b' },
        { id: 'e1-4', source: '1', target: '4' },
        { id: 'e1-5', source: '1', target: '5' },
      ]

      // Try to add a 6th connection (to a different target with no existing connection)
      const connection = {
        source: '1',
        target: '3',
        sourceHandle: 'c', // Different handle to avoid duplicate
        targetHandle: null,
      }

      expect(
        getConnectionValidationMessage(connection, edgesWithMaxConnections, mockNodes)
      ).toBe('Maximum outgoing connections (5) reached')
    })

    it('should return valid message for allowed connection', () => {
      const connection = {
        source: '5',
        target: '1',
        sourceHandle: null,
        targetHandle: null,
      }

      expect(getConnectionValidationMessage(connection, mockEdges, mockNodes)).toBe(
        'Connection is valid'
      )
    })
  })
})
