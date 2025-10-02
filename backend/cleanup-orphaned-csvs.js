import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Campaign } from './src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanupOrphanedCSVs() {
  try {
    console.log('🧹 Starting cleanup of orphaned CSV files...');
    
    const uploadsDir = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('📁 Uploads directory does not exist');
      return;
    }

    // Get all CSV files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    const csvFiles = files.filter(file => file.startsWith('csv-') && file.endsWith('.csv'));
    
    console.log(`📋 Found ${csvFiles.length} CSV files in uploads directory:`);
    csvFiles.forEach(file => console.log(`  - ${file}`));

    // Get all campaigns with CSV file references
    const campaigns = await Campaign.findAll({
      where: {
        csvFilePath: { [Campaign.sequelize.Op.ne]: null }
      },
      attributes: ['id', 'name', 'status', 'csvFileName', 'csvFilePath', 'csvUploadedAt']
    });

    console.log(`\n🎯 Found ${campaigns.length} campaigns with CSV references:`);
    campaigns.forEach(campaign => {
      console.log(`  - Campaign ${campaign.id} (${campaign.name}): ${campaign.csvFileName} - Status: ${campaign.status}`);
    });

    // Check which CSV files are orphaned (not referenced by any campaign)
    const referencedFiles = campaigns
      .map(campaign => campaign.csvFilePath ? path.basename(campaign.csvFilePath) : null)
      .filter(Boolean);

    const orphanedFiles = csvFiles.filter(file => !referencedFiles.includes(file));
    
    console.log(`\n🗑️ Found ${orphanedFiles.length} orphaned CSV files:`);
    orphanedFiles.forEach(file => console.log(`  - ${file}`));

    // Clean up files from completed campaigns
    const completedCampaignFiles = [];
    for (const campaign of campaigns) {
      if (campaign.status === 'completed' && campaign.csvFilePath && fs.existsSync(campaign.csvFilePath)) {
        completedCampaignFiles.push({
          file: path.basename(campaign.csvFilePath),
          campaign: campaign.name,
          id: campaign.id
        });
      }
    }

    console.log(`\n🏁 Found ${completedCampaignFiles.length} CSV files from completed campaigns:`);
    completedCampaignFiles.forEach(item => console.log(`  - ${item.file} (Campaign: ${item.campaign})`));

    // Ask for confirmation before cleanup
    const filesToDelete = [...orphanedFiles, ...completedCampaignFiles.map(item => item.file)];
    
    if (filesToDelete.length === 0) {
      console.log('\n✅ No CSV files need cleanup!');
      return;
    }

    console.log(`\n🚨 Will delete ${filesToDelete.length} CSV files:`);
    filesToDelete.forEach(file => console.log(`  - ${file}`));

    // Perform cleanup
    let deletedCount = 0;
    for (const file of filesToDelete) {
      try {
        const filePath = path.join(uploadsDir, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✅ Deleted: ${file}`);
          deletedCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to delete ${file}: ${error.message}`);
      }
    }

    // Update database for completed campaigns
    for (const item of completedCampaignFiles) {
      try {
        await Campaign.update(
          { 
            csvFileName: null, 
            csvFilePath: null, 
            csvUploadedAt: null 
          },
          { where: { id: item.id } }
        );
        console.log(`✅ Cleared CSV references for campaign ${item.id} (${item.campaign})`);
      } catch (error) {
        console.error(`❌ Failed to update campaign ${item.id}: ${error.message}`);
      }
    }

    console.log(`\n🎉 Cleanup completed! Deleted ${deletedCount} files.`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    process.exit(0);
  }
}

cleanupOrphanedCSVs();
