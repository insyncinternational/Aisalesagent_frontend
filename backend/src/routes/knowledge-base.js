import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getKnowledgeBaseFilePath, getAvailableIndustries, getUseCasesForIndustry } from '../config/knowledgeBaseMapping.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * GET /api/knowledge-base/industries
 * Get all available industries
 */
router.get('/industries', (req, res) => {
  try {
    const industries = getAvailableIndustries();
    res.json({
      success: true,
      industries
    });
  } catch (error) {
    console.error('Error getting industries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get industries'
    });
  }
});

/**
 * GET /api/knowledge-base/use-cases/:industry
 * Get use cases for a specific industry
 */
router.get('/use-cases/:industry', (req, res) => {
  try {
    const { industry } = req.params;
    const useCases = getUseCasesForIndustry(industry);
    
    res.json({
      success: true,
      industry,
      useCases
    });
  } catch (error) {
    console.error('Error getting use cases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get use cases'
    });
  }
});

/**
 * GET /api/knowledge-base/file/:industry/:useCase
 * Get the knowledge base file for a specific industry and use case
 */
router.get('/file/:industry/:useCase', (req, res) => {
  try {
    const { industry, useCase } = req.params;
    
    const filePath = getKnowledgeBaseFilePath(industry, useCase);
    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: 'Knowledge base file not found'
      });
    }

    // Construct the full path to the file
    const fullPath = path.join(__dirname, '../../frontend/public', filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Knowledge base file not found: ${fullPath}`);
      return res.status(404).json({
        success: false,
        error: 'Knowledge base file not found on disk'
      });
    }

    // Set appropriate headers for PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error serving knowledge base file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to serve knowledge base file'
    });
  }
});

/**
 * GET /api/knowledge-base/content/:industry/:useCase
 * Get the content of the knowledge base file as text (for ElevenLabs)
 */
router.get('/content/:industry/:useCase', async (req, res) => {
  try {
    const { industry, useCase } = req.params;
    
    const filePath = getKnowledgeBaseFilePath(industry, useCase);
    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: 'Knowledge base file not found'
      });
    }

    // Construct the full path to the file
    const fullPath = path.join(__dirname, '../../frontend/public', filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Knowledge base file not found: ${fullPath}`);
      return res.status(404).json({
        success: false,
        error: 'Knowledge base file not found on disk'
      });
    }

    // For now, we'll return the file path and let ElevenLabs handle the PDF
    // In a real implementation, you might want to extract text from PDF
    res.json({
      success: true,
      industry,
      useCase,
      filePath: filePath,
      fileName: path.basename(filePath),
      message: 'Knowledge base file ready for ElevenLabs integration'
    });

  } catch (error) {
    console.error('Error getting knowledge base content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get knowledge base content'
    });
  }
});

export default router;
