import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { 
  Phone, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Zap, 
  Sparkles, 
  Bot, 
  Target, 
  Mic, 
  Headphones, 
  Clock, 
  BarChart3, 
  Settings, 
  Globe, 
  Shield, 
  Star, 
  Languages, 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  MicOff,
  CheckCircle,
  ArrowRight,
  Play,
  ChevronRight,
  Building2,
  Heart,
  ShoppingCart,
  GraduationCap,
  Car,
  Scale,
  Utensils,
  Briefcase,
  Calendar,
  Sun,
  Moon,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Video,
  Radio,
  Activity,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import LanguageSwitcher from '@/components/language-switcher';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import BackToTop from '@/components/back-to-top';

// Animated Background Components
const VoiceWaveAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-20">
      <div className="w-full h-full border-2 border-blue-500 rounded-full animate-pulse"></div>
      <div className="absolute top-2 left-2 w-28 h-28 border-2 border-purple-500 rounded-full animate-ping"></div>
      <div className="absolute top-4 left-4 w-24 h-24 border-2 border-blue-400 rounded-full animate-pulse"></div>
    </div>
    <div className="absolute top-3/4 right-1/4 w-24 h-24 opacity-15">
      <div className="w-full h-full border-2 border-purple-500 rounded-full animate-ping"></div>
      <div className="absolute top-2 left-2 w-20 h-20 border-2 border-blue-500 rounded-full animate-pulse"></div>
    </div>
    <div className="absolute top-1/2 right-1/3 w-16 h-16 opacity-25">
      <div className="w-full h-full border-2 border-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1 left-1 w-14 h-14 border-2 border-purple-400 rounded-full animate-ping"></div>
    </div>
  </div>
);

const AIParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      >
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60"></div>
      </div>
    ))}
    {[...Array(5)].map((_, i) => (
      <div
        key={`icon-${i}`}
        className="absolute animate-float-slow opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${6 + Math.random() * 3}s`
        }}
      >
        {i % 3 === 0 && <Mic className="w-4 h-4 text-blue-500" />}
        {i % 3 === 1 && <Radio className="w-4 h-4 text-purple-500" />}
        {i % 3 === 2 && <Activity className="w-4 h-4 text-blue-400" />}
      </div>
    ))}
  </div>
);

const SoundWaveAnimation = () => (
  <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
    <div className="flex items-end justify-center space-x-1 h-full">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="bg-gradient-to-t from-blue-500 to-purple-500 opacity-30 animate-sound-wave"
          style={{
            width: '3px',
            height: `${20 + Math.random() * 40}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.5s'
          }}
        ></div>
      ))}
    </div>
  </div>
);

export default function HomeOption2() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCalling, setIsCalling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [callForm, setCallForm] = useState({
    name: '',
    phone: '',
    industry: '',
    company: ''
  });

  const industries = [
    { name: 'Healthcare', icon: Heart, color: 'from-red-500 to-pink-500' },
    { name: 'E-commerce', icon: ShoppingCart, color: 'from-blue-500 to-cyan-500' },
    { name: 'Real Estate', icon: Building2, color: 'from-green-500 to-emerald-500' },
    { name: 'Education', icon: GraduationCap, color: 'from-purple-500 to-violet-500' },
    { name: 'Automotive', icon: Car, color: 'from-orange-500 to-red-500' },
    { name: 'Legal', icon: Scale, color: 'from-indigo-500 to-blue-500' },
    { name: 'Restaurant', icon: Utensils, color: 'from-yellow-500 to-orange-500' },
    { name: 'Services', icon: Briefcase, color: 'from-teal-500 to-green-500' }
  ];

  const solutions = [
    {
      icon: MessageCircle,
      title: 'Customer Support',
      description: '24/7 automated customer service that never sleeps',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Target,
      title: 'Lead Qualification',
      description: 'AI agents that qualify leads and book appointments',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Sales Automation',
      description: 'Automated follow-ups that convert prospects to customers',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Never miss a call again with round-the-clock AI agents'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant responses and immediate lead qualification'
    },
    {
      icon: Users,
      title: 'Scalable Team',
      description: 'Handle unlimited calls simultaneously without hiring'
    },
    {
      icon: BarChart3,
      title: 'Data Driven',
      description: 'Real-time analytics and performance insights'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Upload Your Data',
      description: 'Add your business information, scripts, and knowledge base'
    },
    {
      step: '2',
      title: 'Train Your AI',
      description: 'Our AI learns your voice, tone, and business processes'
    },
    {
      step: '3',
      title: 'Go Live',
      description: 'Start receiving and making calls with your AI agent'
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: '$150',
      period: '/mo',
      description: 'Perfect for small businesses getting started',
      features: [
        '100 calls per month',
        '1 AI agent',
        'Basic analytics',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$150',
      period: '/mo',
      description: 'Advanced features for growing businesses',
      features: [
        '500 calls per month',
        '3 AI agents',
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ],
      cta: 'Get Started',
      popular: true,
      limited: true
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'Spark AI transformed our lead qualification process. We went from 20% conversion rate to 65% in just 3 months.',
      avatar: 'SJ',
      rating: 5,
      image: '/images/testimonial-1.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Sales Director, RealEstate Pro',
      content: 'The AI agents handle our appointment scheduling flawlessly. Our team can now focus on closing deals instead of managing calendars.',
      avatar: 'MC',
      rating: 5,
      image: '/images/testimonial-2.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder, HealthCare Plus',
      content: 'Patient satisfaction increased by 40% since implementing Spark AI. Our patients love the instant, personalized support.',
      avatar: 'ER',
      rating: 5,
      image: '/images/testimonial-3.jpg'
    }
  ];

  const demoCalls = [
    {
      title: 'Customer Support Demo',
      description: 'See how our AI handles customer inquiries and resolves issues instantly.',
      industry: 'E-commerce',
      duration: '2:30',
      icon: MessageCircle
    },
    {
      title: 'Appointment Booking Demo',
      description: 'Watch our AI agent schedule appointments and manage calendars seamlessly.',
      industry: 'Healthcare',
      duration: '1:45',
      icon: Calendar
    },
    {
      title: 'Sales Qualification Demo',
      description: 'Experience how our AI qualifies leads and books meetings for your sales team.',
      industry: 'Real Estate',
      duration: '3:15',
      icon: Target
    }
  ];

  const faqs = [
    {
      question: 'How does Spark AI work?',
      answer: 'Spark AI uses advanced natural language processing and machine learning to create intelligent voice agents that can handle customer calls, qualify leads, and book appointments automatically.'
    },
    {
      question: 'Can I customize the AI agent?',
      answer: 'Yes! You can train the AI with your business information, scripts, and knowledge base. The AI will learn your voice, tone, and business processes.'
    },
    {
      question: 'What languages are supported?',
      answer: 'Spark AI supports over 100 languages with natural-sounding voices and accents. You can also clone your own voice for a personalized experience.'
    },
    {
      question: 'How much does it cost?',
      answer: 'Our pricing starts at $150/month for the Basic plan with 100 calls. We also offer a Pro plan with advanced features and higher call volumes.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! We offer a 14-day free trial with no credit card required. You can test all features and see the results before committing.'
    }
  ];

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalling(true);
    
    // Simulate call initiation
    setTimeout(() => {
      setIsCalling(false);
      toast({
        title: "Call Initiated!",
        description: "Our AI agent will call you shortly to demonstrate our capabilities.",
        variant: "default",
      });
    }, 2000);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="cursor-pointer">
                <Logo size="md" showText={true} />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <a href="#benefits" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Benefits
              </a>
              <a href="#pricing" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Pricing
              </a>
              <Link href="/about" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                Try for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <a href="#benefits" className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)}>
                  Benefits
                </a>
                <a href="#pricing" className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)}>
                  Pricing
                </a>
                <Link href="/about" className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
                <Link href="/contact" className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" onClick={() => setMobileMenuOpen(false)}>
                    Try for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero / Main fold */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <VoiceWaveAnimation />
        <AIParticles />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Stars */}
            <div className="flex justify-center mb-6 animate-fade-in-scale">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 text-yellow-400 fill-current animate-fade-in-scale animate-delay-${(i + 1) * 100}`} />
              ))}
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up">
              Transform Your Business with{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 bg-clip-text text-transparent animate-typewriter">
                AI Voice Agents
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
              Never miss another call. Our AI agents work 24/7 to qualify leads, 
              book appointments, and provide customer support that converts.
            </p>

            {/* CTA Button */}
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white px-8 py-4 text-lg mb-12 animate-voice-pulse animate-fade-in-up animate-delay-400"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Video Placeholder */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-8 max-w-4xl mx-auto animate-ai-glow animate-fade-in-scale animate-delay-600">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center">
                <Play className="w-16 h-16 text-white mx-auto mb-4 animate-voice-pulse" />
                <h3 className="text-2xl font-bold text-white mb-2 animate-fade-in-up animate-delay-700">See Spark AI in Action</h3>
                <p className="text-white/80 mb-6 animate-fade-in-up animate-delay-800">Watch our AI agent handle real customer calls</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 animate-fade-in-up animate-delay-900">
                  Play Demo Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missed Calls = Missed Revenue */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              24/7 Call Handling
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Missed Calls = Missed Revenue
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Every missed call costs your company money. Answer every call 24/7/365.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Problem Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <X className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Problem</h3>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Overwhelmed by repetitive calls?
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Want to get more leads?',
                  'Struggling with high call volume?',
                  'Distracted from important tasks?',
                  'Looking for a scalable, 24/7 solution?'
                ].map((problem, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{problem}</span>
                  </div>
                ))}
              </div>

              {/* Problem Cards */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg transform rotate-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Out-of-hours calls</span>
                    </div>
                    <div className="text-2xl font-bold text-red-500">7</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg transform -rotate-1 mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Unqualified leads</span>
                    </div>
                    <div className="text-2xl font-bold text-red-500">32</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg transform rotate-1 -mt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Canceled tasks</span>
                    </div>
                    <div className="text-2xl font-bold text-red-500">12</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg transform -rotate-2 mt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Missed calls</span>
                    </div>
                    <div className="text-2xl font-bold text-red-500">7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Solution</h3>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Automate calls with AI Voice Agents
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { text: 'Generate More Leads & Qualified Appointments', icon: '💰' },
                  { text: 'Convert More Sales Opportunities', icon: '📈' },
                  { text: 'Allocate Your Time to what matters most', icon: '⏰' },
                  { text: 'Automatically Nurture Leads & Never Miss A Call Again', icon: '🎧' }
                ].map((solution, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 flex items-center">
                      <span className="mr-2">{solution.icon}</span>
                      {solution.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Solution Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">24/7 Availability</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">✓</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Qualified leads</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">41</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Freed-up tasks</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">17</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">No missed calls</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-slate-600 dark:text-slate-400 mb-6">Trusted by leading companies</p>
          </div>
          <div className="flex justify-center items-center space-x-8 opacity-60 flex-wrap gap-4">
            {/* Company Logos */}
            <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6" />
            </div>
            <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/77/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="h-6" />
            </div>
            <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/Amazon_logo.svg" alt="Amazon" className="h-6" />
            </div>
            <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft Azure" className="h-6" />
            </div>
            <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" alt="OpenAI" className="h-6" />
            </div>
            <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Salesforce_logo.svg" alt="Salesforce" className="h-6" />
            </div>
            <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-6" />
            </div>
            <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logitech_logo.svg" alt="Logitech" className="h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up">
              Solutions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
              Focus on what your audience gains. Use short, outcome-driven statements with icons to emphasize key improvements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <div key={index} className={`text-center animate-fade-in-scale animate-delay-${(index + 1) * 300}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl mb-6 animate-fade-in-scale animate-delay-400`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-left animate-delay-500">
                    {solution.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 animate-fade-in-right animate-delay-600">
                    {solution.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up">
              Benefits
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
              Highlight your product's key advantages - 24/7 functionality, seamless integration, and superior efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className={`text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl animate-fade-in-up animate-delay-${(index + 1) * 200}`}>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in-scale animate-delay-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 animate-fade-in-left animate-delay-400">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm animate-fade-in-right animate-delay-500">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <AIParticles />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up">
              How it Works?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
              Show that your solution is easy to implement. Describe the process in 3 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className={`text-center animate-fade-in-up animate-delay-${(index + 1) * 200}`}>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in-scale animate-delay-300">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-left animate-delay-400">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 animate-fade-in-right animate-delay-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up">
              Trusted Across Industries
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
              From healthcare to real estate, our AI agents adapt to your industry's unique needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <div key={index} className={`group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-scale animate-delay-${(index + 1) * 100}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${industry.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300 animate-fade-in-scale animate-delay-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 animate-fade-in-left animate-delay-400">{industry.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 animate-fade-in-right animate-delay-500">
                    {industry.name === 'Healthcare' && 'Appointment scheduling, patient reminders, and support'}
                    {industry.name === 'E-commerce' && 'Order tracking, returns, and customer support'}
                    {industry.name === 'Real Estate' && 'Lead qualification, property inquiries, and scheduling'}
                    {industry.name === 'Education' && 'Student support, enrollment, and information'}
                    {industry.name === 'Automotive' && 'Service appointments, sales follow-ups, and support'}
                    {industry.name === 'Legal' && 'Client intake, appointment scheduling, and case updates'}
                    {industry.name === 'Restaurant' && 'Reservations, orders, and customer service'}
                    {industry.name === 'Services' && 'Appointment booking, follow-ups, and support'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Calls Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <SoundWaveAnimation />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up">
              See Spark AI in Action
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
              Watch real demo calls across different industries and use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoCalls.map((demo, index) => {
              const Icon = demo.icon;
              return (
                <div key={index} className={`bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 animate-fade-in-up animate-delay-${(index + 1) * 300}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center animate-fade-in-scale animate-delay-400">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white animate-fade-in-left animate-delay-500">{demo.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 animate-fade-in-right animate-delay-600">{demo.industry}</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up animate-delay-700">{demo.duration}</div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 animate-fade-in-up animate-delay-800">{demo.description}</p>
                  <Button variant="outline" className="w-full animate-fade-in-up animate-delay-900">
                    <Play className="mr-2 w-4 h-4" />
                    Watch Demo
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Make the decision easy. Present clear plans, simple pricing, and strong reasons to act now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white dark:bg-slate-700 rounded-2xl p-8 border-2 ${
                plan.popular ? 'border-blue-500' : 'border-slate-200 dark:border-slate-600'
              }`}>
                {plan.limited && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Limited
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-500'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Booking */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              LET'S CONNECT
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Book a free consultation with our AI experts
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Get personalized advice on how AI voice agents can transform your business
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Section - Consultation Details */}
              <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                {/* Host Profile */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">AI</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AI Expert Team</h3>
                  <p className="text-slate-600 dark:text-slate-400">Spark AI Specialists</p>
                </div>

                {/* Call Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Agent Discovery Call</h4>
                    <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>30 min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Video className="w-5 h-5" />
                        <span>Web conferencing details provided upon confirmation</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-600 rounded-xl p-6">
                    <p className="text-slate-700 dark:text-slate-300 font-medium mb-4">
                      Schedule a free discovery call with our AI experts!
                    </p>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">We'll cover:</h5>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Your business needs and challenges
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Custom AI strategy for your industry
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Implementation roadmap and timeline
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-500 pt-4">
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">Hear it from others:</h5>
                      <blockquote className="text-slate-600 dark:text-slate-400 italic">
                        "The AI experts at Spark AI were professional and attentive during our consultation. They created an amazing AI voice agent strategy for our business that increased our conversion rate by 300%."
                      </blockquote>
                      <cite className="text-sm text-slate-500 dark:text-slate-400 mt-2 block">
                        - Sarah Johnson, CEO TechStart Inc.
                      </cite>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Calendar */}
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Select a Date & Time</h3>
                
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white">June 2025</h4>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="mb-6">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((date) => (
                      <button
                        key={date}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          date === 30
                            ? 'bg-blue-500 text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-6">
                  <h5 className="font-semibold text-slate-900 dark:text-white mb-3">Available Times</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                      <button
                        key={time}
                        className="p-3 text-sm font-medium border border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Zone */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Globe className="w-4 h-4" />
                    <span>Kazakhstan Time (21:53)</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Book Button */}
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3">
                  Book Free Consultation
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-500 dark:text-slate-400">
              Can't find a time that works?{' '}
              <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                Contact us directly
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Why Top Companies Choose Spark AI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              WORLD-CLASS VOICE AI AGENTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Why top companies choose Spark AI
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="text-left py-6 px-8 text-lg font-semibold text-slate-900 dark:text-white">
                      Benefits
                    </th>
                    <th className="text-center py-6 px-8">
                      <div className="inline-flex items-center justify-center w-32 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <span className="text-white font-bold text-lg">SPARK AI</span>
                      </div>
                    </th>
                    <th className="text-center py-6 px-8 text-lg font-semibold text-slate-900 dark:text-white">
                      Other AI Platforms
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    'Experienced AI Engineers & Voice Specialists',
                    'Innovative Development Practices',
                    'Complete Custom Development',
                    'Client-Centric Approach',
                    'Rigorous Testing and Validation',
                    'Connections With All Major AI Platforms'
                  ].map((benefit, index) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-600">
                      <td className="py-6 px-8 text-slate-700 dark:text-slate-300 font-medium">
                        {benefit}
                      </td>
                      <td className="text-center py-6 px-8">
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </td>
                      <td className="text-center py-6 px-8">
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
                          <X className="w-5 h-5 text-white" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <AIParticles />
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="text-center mb-16">
             <div className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4 text-reveal">
               WHO IS BEHIND SPARK AI
             </div>
             <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 text-reveal">
               Meet our team
             </h2>
             <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-reveal">
               The experts behind Spark AI's revolutionary voice agent technology
             </p>
           </div>

           <div className="flex flex-wrap justify-center gap-2 max-w-6xl mx-auto">
             {[
               {
                 name: 'Brendan',
                 title: 'Founder',
                 image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
                 color: 'from-blue-500 to-purple-500',
                 description: 'AI strategy and business development expert'
               },
               {
                 name: 'Tyler',
                 title: 'Consultant',
                 image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
                 color: 'from-green-500 to-emerald-500',
                 description: 'Voice AI implementation specialist'
               },
               {
                 name: 'Nathan',
                 title: 'Head Of Dev',
                 image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
                 color: 'from-purple-500 to-pink-500',
                 description: 'Lead AI engineer and platform architect'
               },
               {
                 name: 'Logan',
                 title: 'Engineer',
                 image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
                 color: 'from-orange-500 to-red-500',
                 description: 'Full-stack developer and AI integration expert'
               },
               {
                 name: 'Zach',
                 title: 'SDR',
                 image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
                 color: 'from-teal-500 to-cyan-500',
                 description: 'Sales development and client success manager'
               }
             ].map((member, index) => (
               <div key={index} className={`team-card group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-600 w-64 ${index > 0 ? '-ml-4' : ''}`}>
                 <div className="text-center">
                   <div className="avatar-3d w-24 h-24 rounded-2xl mx-auto mb-4 shadow-lg group-hover:shadow-xl overflow-hidden bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600">
                     <img 
                       src={member.image} 
                       alt={member.name}
                       className="w-full h-full object-cover rounded-xl"
                     />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                     {member.name}
                   </h3>
                   <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">
                     {member.title}
                   </p>
                   <p className="text-sm text-slate-600 dark:text-slate-400">
                     {member.description}
                   </p>
                 </div>
               </div>
             ))}
          </div>

          {/* Team Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
              <div className="text-slate-600 dark:text-slate-400">Years Combined Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">500+</div>
              <div className="text-slate-600 dark:text-slate-400">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">95%</div>
              <div className="text-slate-600 dark:text-slate-400">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
              <div className="text-slate-600 dark:text-slate-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Testimonials
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Show customer success stories with real photos and results. Keep it personal and relatable to your audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <VoiceWaveAnimation />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-12 text-white animate-ai-glow">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Use action-driven CTAs like 'Try for Free' or 'Book a Demo' with a short benefit (e.g., 'Save 10+ hours a week').
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Try for Free - Save 10+ Hours/Week
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              FAQ
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Answer common questions simply. Focus on removing doubts about pricing, setup, or features.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo size="md" showText={true} />
            </div>
            <div className="flex space-x-8 mb-6 md:mb-0">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              <a href="#benefits" className="text-slate-400 hover:text-white transition-colors">Benefits</a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
              <Link href="/about" className="text-slate-400 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">© 2024 Spark AI. All rights reserved.</p>
              <p className="text-slate-500 text-xs mt-1">wecreatebrand.com</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
