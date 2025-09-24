import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Settings, 
  Rocket, 
  Users, 
  Phone, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Square
} from 'lucide-react';

const CampaignWorkflowBanner = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const workflowSteps = [
    {
      id: 1,
      title: "Create Campaign",
      description: "Set up your voice calling campaign",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      details: [
        "Enter campaign name and description",
        "Write your opening message",
        "Configure AI personality",
        "Set campaign objectives"
      ],
      features: ["Campaign Setup", "Message Creation", "AI Configuration"]
    },
    {
      id: 2,
      title: "Upload Leads",
      description: "Add your contact list",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      details: [
        "Upload CSV file with contacts",
        "Map contact fields (name, phone, email)",
        "Validate phone numbers",
        "Preview lead data"
      ],
      features: ["CSV Upload", "Field Mapping", "Data Validation"]
    },
    {
      id: 3,
      title: "Configure AI",
      description: "Set up voice and knowledge base",
      icon: Settings,
      color: "from-blue-500 to-purple-500",
      details: [
        "Select AI voice (ElevenLabs)",
        "Upload knowledge base documents",
        "Configure conversation flow",
        "Set call parameters"
      ],
      features: ["Voice Selection", "Knowledge Base", "AI Setup"]
    },
    {
      id: 4,
      title: "Test & Launch",
      description: "Test and start your campaign",
      icon: Rocket,
      color: "from-orange-500 to-red-500",
      details: [
        "Make test calls to verify setup",
        "Review campaign settings",
        "Start campaign execution",
        "Monitor call progress"
      ],
      features: ["Test Calls", "Campaign Launch", "Progress Monitoring"]
    },
    {
      id: 5,
      title: "Monitor Results",
      description: "Track campaign performance",
      icon: BarChart3,
      color: "from-indigo-500 to-purple-500",
      details: [
        "View call statistics",
        "Analyze success rates",
        "Review call recordings",
        "Export results"
      ],
      features: ["Analytics", "Call Logs", "Performance Reports"]
    }
  ];

  const currentStepData = workflowSteps[currentStep];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % workflowSteps.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [workflowSteps.length]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 rounded-2xl p-6 mb-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-brand-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            How Campaigns Work
          </h2>
          <p className="text-brand-200 text-lg">
            Follow these simple steps to create and launch your AI voice calling campaigns
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Current Step */}
          <div className="space-y-6">
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentStepData.color} shadow-lg`}>
                  <currentStepData.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Step {currentStepData.id}: {currentStepData.title}
                  </h3>
                  <p className="text-brand-200">
                    {currentStepData.description}
                  </p>
                </div>
              </div>

              {/* Step Details */}
              <div className="space-y-3">
                {currentStepData.details.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/90">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {currentStepData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Workflow Steps */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white mb-4">Campaign Workflow</h4>
            {workflowSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  index === currentStep
                    ? 'bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentStep(index);
                    setIsAnimating(false);
                  }, 300);
                }}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${step.color} ${
                  index === currentStep ? 'scale-110' : 'scale-100'
                } transition-transform duration-300`}>
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white/80">
                      Step {step.id}
                    </span>
                    {index === currentStep && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                  </div>
                  <h5 className="text-white font-semibold">{step.title}</h5>
                  <p className="text-brand-200 text-sm">{step.description}</p>
                </div>
                {index === currentStep && (
                  <ArrowRight className="h-5 w-5 text-white animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {workflowSteps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-white scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentStep(index);
                  setIsAnimating(false);
                }, 300);
              }}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Play className="h-5 w-5" />
            <span>Start Your First Campaign</span>
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignWorkflowBanner;
