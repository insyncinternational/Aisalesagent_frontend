import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { api, type Campaign } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { useToast } from "@/hooks/use-toast";
import CampaignManagement from "@/components/campaign-management";
import { CampaignCard } from "@/components/campaign-card";
import { useLocation } from "wouter";
import CampaignWorkflowBanner from "@/components/campaign-workflow-banner";
import ThemeToggle from "@/components/theme-toggle";

interface CampaignManagementProps {
  campaignId?: string;
}

export default function Campaigns({ campaignId }: CampaignManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
    queryFn: api.getCampaigns,
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: (id: number) => api.deleteCampaign(id),
    onSuccess: () => {
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setShowDeleteDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (campaignToDelete) {
      deleteCampaignMutation.mutate(campaignToDelete.id);
    }
  };

  const handleEditClick = (campaign: Campaign) => {
    // Validate that campaign can be edited (draft status with no calls)
    const canEdit = campaign.status === 'draft' && (campaign.completedCalls || 0) === 0;
    
    if (!canEdit) {
      toast({
        title: "Cannot Edit Campaign",
        description: campaign.status !== 'draft' 
          ? "Only draft campaigns can be edited" 
          : "Cannot edit campaigns with completed calls",
        variant: "destructive",
      });
      return;
    }
    
    setLocation(`/campaigns/${campaign.id}/edit`);
  };

  const filteredCampaigns = campaigns?.filter((campaign: Campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-brand-50 dark:bg-brand-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="relative bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-800 px-8 py-6 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 100" fill="none">
              <defs>
                <pattern id="campaigns-header-pattern" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
                  <circle cx="35" cy="35" r="2" fill="currentColor" className="text-brand-500"/>
                  <path d="M35 0L35 30M0 35L30 35M35 35L35 65M40 35L70 35" stroke="currentColor" strokeWidth="1" className="text-brand-400"/>
                  <circle cx="35" cy="35" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-brand-300"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#campaigns-header-pattern)"/>
            </svg>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-28 w-5 h-5 bg-brand-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-28 w-4 h-4 bg-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-brand-900 dark:text-white">Campaigns</h2>
              <p className="text-brand-600 dark:text-brand-300 mt-2">Manage all your voice calling campaigns</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setLocation("/campaigns/new")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Campaign
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Campaign Workflow Banner */}
            <CampaignWorkflowBanner />
            
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-brand-800"
                />
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-brand-600 dark:text-brand-300">Loading campaigns...</p>
              </div>
            ) : filteredCampaigns?.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300">No campaigns found</h3>
                <p className="text-brand-600 dark:text-brand-400 mt-2">Get started by creating a new campaign.</p>
                <button 
                  onClick={() => setLocation("/campaigns/new")} 
                  className="mt-4 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Campaign
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns?.map((campaign: Campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the "{campaignToDelete?.name}" campaign.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}