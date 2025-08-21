// Demo vector search service

class VectorSearchService {
  async searchVectors(query, options = {}) {
    // Return mock search results
    return [
      {
        id: 'vec-1',
        content: 'FITS AI system architecture overview',
        similarity: 0.95,
        metadata: { document_id: 'doc-1', section: 'overview' }
      },
      {
        id: 'vec-2',
        content: 'Backend service configuration',
        similarity: 0.89,
        metadata: { document_id: 'doc-2', section: 'config' }
      }
    ];
  }

  async indexDocument(documentData) {
    throw new Error('Document indexing not available in demo mode');
  }

  async deleteDocument(documentId) {
    throw new Error('Document deletion not available in demo mode');
  }

  async getEmbeddings(text) {
    // Return mock embedding vector
    return Array.from({ length: 1536 }, () => Math.random());
  }
}

export const vectorSearchService = new VectorSearchService();
export default vectorSearchService;