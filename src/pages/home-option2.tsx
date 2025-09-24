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
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import LanguageSwitcher from '@/components/language-switcher';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import BackToTop from '@/components/back-to-top';

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
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Stars */}
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Transform Your Business with{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                AI Voice Agents
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
              Never miss another call. Our AI agents work 24/7 to qualify leads, 
              book appointments, and provide customer support that converts.
            </p>

            {/* CTA Button */}
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white px-8 py-4 text-lg mb-12"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Video Placeholder */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center">
                <Play className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">See Spark AI in Action</h3>
                <p className="text-white/80 mb-6">Watch our AI agent handle real customer calls</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Play Demo Video
                </Button>
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
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Solutions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Focus on what your audience gains. Use short, outcome-driven statements with icons to emphasize key improvements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {solution.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {solution.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Benefits
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Highlight your product's key advantages - 24/7 functionality, seamless integration, and superior efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              How it Works?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Show that your solution is easy to implement. Describe the process in 3 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Calls Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              See Spark AI in Action
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Watch real demo calls across different industries and use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoCalls.map((demo, index) => {
              const Icon = demo.icon;
              return (
                <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{demo.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{demo.industry}</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{demo.duration}</div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{demo.description}</p>
                  <Button variant="outline" className="w-full">
                    <Play className="mr-2 w-4 h-4" />
                    Watch Demo
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Trusted Across Industries
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              From healthcare to real estate, our AI agents adapt to your industry's unique needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <div key={index} className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${industry.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{industry.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-12 text-white">
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
