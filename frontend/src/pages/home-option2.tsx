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
  Cpu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import LanguageSwitcher from '@/components/language-switcher';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import BackToTop from '@/components/back-to-top';
import CalendlyScheduling from '@/components/calendly-scheduling';
import AIDemoCall from '@/components/ai-demo-call';
import AIDemoCallMinimal from '@/components/ai-demo-call-minimal';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Animation observer for scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.text-reveal, .team-card, .fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const industries = [
    { name: t('home.industries.healthcare'), icon: Heart, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.ecommerce'), icon: ShoppingCart, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.realEstate'), icon: Building2, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.education'), icon: GraduationCap, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.automotive'), icon: Car, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.legal'), icon: Scale, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.restaurant'), icon: Utensils, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.services'), icon: Briefcase, color: 'from-blue-500 to-purple-500' }
  ];

  const solutions = [
    {
      icon: MessageCircle,
      title: t('home.solutions.customerSupport.title'),
      description: t('home.solutions.customerSupport.description'),
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Target,
      title: t('home.solutions.leadQualification.title'),
      description: t('home.solutions.leadQualification.description'),
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: t('home.solutions.salesAutomation.title'),
      description: t('home.solutions.salesAutomation.description'),
      color: 'from-blue-500 to-purple-500'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: t('home.features.availability.title'),
      description: t('home.features.availability.description')
    },
    {
      icon: Zap,
      title: t('home.features.lightningFast.title'),
      description: t('home.features.lightningFast.description')
    },
    {
      icon: Users,
      title: t('home.features.scalableTeam.title'),
      description: t('home.features.scalableTeam.description')
    },
    {
      icon: BarChart3,
      title: t('home.features.dataDriven.title'),
      description: t('home.features.dataDriven.description')
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: t('home.features.uploadData.title'),
      description: t('home.features.uploadData.description')
    },
    {
      step: '2',
      title: t('home.features.trainAi.title'),
      description: t('home.features.trainAi.description')
    },
    {
      step: '3',
      title: t('home.features.goLive.title'),
      description: t('home.features.goLive.description')
    }
  ];

  const pricingPlans = [
    {
      name: t('home.pricing.basic.name'),
      price: '$150',
      period: '/mo',
      description: t('home.pricing.basic.description'),
      features: [
        '100 calls per month',
        '1 AI agent',
        t('home.pricing.basic.features.0'),
        t('home.pricing.basic.features.1')
      ],
      cta: t('home.pricing.basic.cta'),
      popular: false
    },
    {
      name: t('home.pricing.pro.name'),
      price: '$150',
      period: '/mo',
      description: t('home.pricing.pro.description'),
      features: [
        '500 calls per month',
        '3 AI agents',
        t('home.pricing.pro.features.0'),
        t('home.pricing.pro.features.1'),
        t('home.pricing.pro.features.2')
      ],
      cta: t('home.pricing.pro.cta'),
      popular: true,
      limited: true
    }
  ];

  const testimonials = [
    {
      name: t('home.testimonials.sarah.name'),
      role: 'CEO, TechStart Inc.',
      content: t('home.testimonials.sarah.content'),
      avatar: 'SJ',
      rating: 5,
      image: '/images/testimonial-1.jpg'
    },
    {
      name: t('home.testimonials.michael.name'),
      role: t('home.testimonials.michael.role'),
      content: t('home.testimonials.michael.content'),
      avatar: 'MC',
      rating: 5,
      image: '/images/testimonial-2.jpg'
    },
    {
      name: t('home.testimonials.emily.name'),
      role: t('home.testimonials.emily.role'),
      content: t('home.testimonials.emily.content'),
      avatar: 'ER',
      rating: 5,
      image: '/images/testimonial-3.jpg'
    }
  ];

  const demoCalls = [
    {
      title: t('home.demos.customerSupport.title'),
      description: t('home.demos.customerSupport.description'),
      industry: 'E-commerce',
      duration: '2:30',
      icon: MessageCircle
    },
    {
      title: t('home.demos.appointmentBooking.title'),
      description: t('home.demos.appointmentBooking.description'),
      industry: t('home.demos.appointmentBooking.industry'),
      duration: '1:45',
      icon: Calendar
    },
    {
      title: t('home.demos.salesQualification.title'),
      description: t('home.demos.salesQualification.description'),
      industry: 'Real Estate',
      duration: '3:15',
      icon: Target
    }
  ];

  const faqs = [
    {
      question: t('home.faqs.howItWorks.question'),
      answer: t('home.faqs.howItWorks.answer')
    },
    {
      question: t('home.faqs.customization.question'),
      answer: t('home.faqs.customization.answer')
    },
    {
      question: t('home.faqs.languages.question'),
      answer: t('home.faqs.languages.answer')
    },
    {
      question: t('home.faqs.pricing.question'),
      answer: t('home.faqs.pricing.answer')
    },
    {
      question: t('home.faqs.freeTrial.question'),
      answer: t('home.faqs.freeTrial.answer')
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 scroll-smooth relative overflow-hidden">
      {/* Smart Background Graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs - Brand Colors Only */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-brand-300 to-brand-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        
        {/* Floating Elements - Brand Colors */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-500 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-brand-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-brand-600 rounded-full animate-bounce opacity-60" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-brand-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '3s'}}></div>
      </div>
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50/50 shadow-lg dark:shadow-2xl dark:shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Logo size="md" showText={true} />
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Main fold */}
      <section id="hero" className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-25 via-brand-50 to-brand-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden min-h-screen flex items-center">
        {/* Smart Hero Graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Gradient Orbs - Brand Colors */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -top-20 -right-40 w-80 h-80 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-brand-300 to-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
          
          {/* Floating AI Icons - Brand Colors */}
          <div className="absolute top-20 left-20 w-8 h-8 text-brand-500 opacity-20 animate-float-slow">
            <Bot className="w-full h-full" />
          </div>
          <div className="absolute top-32 right-32 w-6 h-6 text-brand-400 opacity-20 animate-float-slow" style={{animationDelay: '1s'}}>
            <Mic className="w-full h-full" />
          </div>
          <div className="absolute bottom-32 left-32 w-7 h-7 text-brand-600 opacity-20 animate-float-slow" style={{animationDelay: '2s'}}>
            <Phone className="w-full h-full" />
          </div>
          <div className="absolute bottom-20 right-20 w-5 h-5 text-brand-300 opacity-20 animate-float-slow" style={{animationDelay: '3s'}}>
            <MessageCircle className="w-full h-full" />
          </div>
          
          {/* Geometric Shapes - Brand Colors */}
          <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-brand-300 rounded-lg rotate-45 opacity-10 animate-spin-slow"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 border-2 border-brand-400 rounded-full opacity-10 animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/2 w-20 h-20 border-2 border-brand-500 rounded-lg rotate-12 opacity-10 animate-pulse"></div>
        </div>
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up leading-tight px-4">
              {t('home.hero.title')}
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto animate-fade-in-up animate-delay-200 px-4">
              {t('home.hero.subtitle')}
            </p>

            {/* CTA Button */}
            <Link href="/login">
            <Button 
              size="lg" 
                className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 hover:from-brand-600 hover:via-brand-700 hover:to-brand-800 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg mb-12 animate-voice-pulse animate-fade-in-up animate-delay-400 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >
              {t('home.hero.startFreeTrial')}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            </Link>

            {/* Enhanced Video Section */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-scale animate-delay-600">
              <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl animate-ai-glow">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-12 md:p-16 lg:p-20 text-center relative overflow-hidden">
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent animate-pulse"></div>
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-ping"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  
                  {/* Video Content */}
                  <div className="relative z-10">
                    {/* Large Play Button */}
                    <div className="mb-8">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 animate-voice-pulse hover:scale-110 transition-transform duration-300 cursor-pointer group">
                        <Play className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white group-hover:text-brand-200 transition-colors" />
                      </div>
                    </div>
                    
                    {/* Enhanced Content */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up animate-delay-700 leading-tight">
                      {t('home.hero.seeInAction')}
                    </h3>
                    <p className="text-white/90 mb-8 animate-fade-in-up animate-delay-800 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                      {t('home.hero.watchDescription')}
                    </p>
                    
                    {/* Enhanced AI Demo Call Section - Minimal Version */}
                    <div className="flex justify-center animate-fade-in-up animate-delay-900">
                      <div className="w-full max-w-2xl">
                        <AIDemoCallMinimal className="p-6" />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up animate-delay-1000">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('home.hero.stats.successRate')}</div>
                        <div className="text-white/80 text-sm sm:text-base">{t('home.hero.stats.successRateLabel')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('home.hero.stats.availability')}</div>
                        <div className="text-white/80 text-sm sm:text-base">{t('home.hero.stats.availabilityLabel')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('home.hero.stats.languages')}</div>
                        <div className="text-white/80 text-sm sm:text-base">{t('home.hero.stats.languagesLabel')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missed Calls = Missed Revenue */}
      <section id="problem" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-25 via-brand-50 to-brand-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen flex items-center">
        {/* Smart Problem Section Graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Problem vs Solution Graphics - Brand Colors */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-gradient-to-r from-brand-300 to-brand-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
          
          {/* Problem Icons - Brand Colors */}
          <div className="absolute top-32 left-32 w-6 h-6 text-brand-500 opacity-20 animate-bounce">
            <X className="w-full h-full" />
          </div>
          <div className="absolute top-48 right-48 w-8 h-8 text-brand-400 opacity-20 animate-bounce" style={{animationDelay: '1s'}}>
            <CheckCircle className="w-full h-full" />
          </div>
          <div className="absolute bottom-32 left-48 w-7 h-7 text-brand-600 opacity-20 animate-bounce" style={{animationDelay: '2s'}}>
            <TrendingUp className="w-full h-full" />
          </div>
          
          {/* Data Visualization Elements - Brand Colors */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-brand-500 rounded-full opacity-30 animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-brand-400 rounded-full opacity-30 animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-brand-600 rounded-full opacity-30 animate-ping" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              {t('home.problem.tag')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight px-4">
              {t('home.problem.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4">
              {t('home.problem.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Problem Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Problem</h3>
              </div>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8">
                Overwhelmed by repetitive calls?
              </p>
              
              <div className="space-y-4 mb-8">
                {(t('home.problem.problems', { returnObjects: true }) as string[]).map((problem: string, index: number) => (
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
                  <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl transform rotate-2 border dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Out-of-hours calls</span>
                    </div>
                    <div className="text-2xl font-bold text-red-500">7</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl transform -rotate-1 mt-4 border dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Unqualified leads</span>
                    </div>
                    <div className="text-2xl font-bold text-red-500">32</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl transform rotate-1 -mt-2 border dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Canceled tasks</span>
                    </div>
                    <div className="text-2xl font-bold text-red-500">12</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl transform -rotate-2 mt-2 border dark:border-slate-700/50">
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Solution</h3>
              </div>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8">
                Automate calls with AI Voice Agents
              </p>
              
              <div className="space-y-4 mb-8">
                {(t('home.problem.solutions', { returnObjects: true }) as string[]).map((solution: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      {solution}
                    </span>
                  </div>
                ))}
              </div>

              {/* Solution Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl border dark:border-slate-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">24/7 Availability</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">✓</div>
                </div>
                <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl border dark:border-slate-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Qualified leads</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">41</div>
                </div>
                <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl border dark:border-slate-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Freed-up tasks</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">17</div>
                </div>
                <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl border dark:border-slate-700/50">
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-reveal">{t('home.companies.trustedBy')}</p>
          </div>
          
          {/* Running Logo Animation */}
          <div className="logo-container">
            <div className="logo-scroll">
              {/* First set of logos */}
              {[
                { name: 'Google', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
                { name: 'Microsoft', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
                { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
                { name: 'Apple', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
                { name: 'Meta', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
                { name: 'Tesla', src: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg' },
                { name: 'Shopify', src: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' },
                { name: 'Slack', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg' },
                { name: 'Netflix', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
                { name: 'Spotify', src: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg' },
                { name: 'Uber', src: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Uber_logo_2018.svg' },
                { name: 'Airbnb', src: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' }
              ].map((logo, index) => (
                <div key={`first-${index}`} className="logo-item w-32 h-20 bg-white dark:bg-slate-700/80 dark:backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-600/50 opacity-70 hover:opacity-100 hover:shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-700/80">
                  <img src={logo.src} alt={logo.name} className="h-10 max-w-24 object-contain filter drop-shadow-sm" />
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {[
                { name: 'Google', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
                { name: 'Microsoft', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
                { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
                { name: 'Apple', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
                { name: 'Meta', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
                { name: 'Tesla', src: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg' },
                { name: 'Shopify', src: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' },
                { name: 'Slack', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg' },
                { name: 'Netflix', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
                { name: 'Spotify', src: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg' },
                { name: 'Uber', src: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Uber_logo_2018.svg' },
                { name: 'Airbnb', src: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' }
              ].map((logo, index) => (
                <div key={`second-${index}`} className="logo-item w-32 h-20 bg-white dark:bg-slate-700/80 dark:backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-600/50 opacity-70 hover:opacity-100 hover:shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-700/80">
                  <img src={logo.src} alt={logo.name} className="h-10 max-w-24 object-contain filter drop-shadow-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%235965f0%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-semibold mb-4 animate-fade-in-up">
              🚀 SOLUTIONS
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200">
              {t('home.solutionsSection.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
              {t('home.solutionsSection.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <div key={index} className={`group relative text-center animate-fade-in-scale animate-delay-${(index + 1) * 200}`}>
                  <div className="relative p-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${solution.color} rounded-2xl mb-6 animate-fade-in-scale animate-delay-300 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-2xl`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-left animate-delay-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {solution.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 animate-fade-in-right animate-delay-500 leading-relaxed">
                      {solution.description}
                    </p>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-25 via-brand-50 to-brand-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden min-h-screen flex items-center">
        {/* Smart Benefits Graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Benefits Gradient Orbs - Brand Colors */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-gradient-to-r from-brand-300 to-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
          
          {/* Benefits Icons - Brand Colors */}
          <div className="absolute top-20 left-20 w-8 h-8 text-brand-500 opacity-20 animate-float-slow">
            <Clock className="w-full h-full" />
          </div>
          <div className="absolute top-32 right-20 w-6 h-6 text-brand-400 opacity-20 animate-float-slow" style={{animationDelay: '1s'}}>
            <Zap className="w-full h-full" />
          </div>
          <div className="absolute bottom-20 left-20 w-7 h-7 text-brand-600 opacity-20 animate-float-slow" style={{animationDelay: '2s'}}>
            <Users className="w-full h-full" />
          </div>
          <div className="absolute bottom-32 right-32 w-5 h-5 text-brand-300 opacity-20 animate-float-slow" style={{animationDelay: '3s'}}>
            <BarChart3 className="w-full h-full" />
          </div>
          
          {/* Geometric Benefits Shapes - Brand Colors */}
          <div className="absolute top-1/3 left-1/3 w-16 h-16 border-2 border-brand-300 rounded-lg rotate-45 opacity-10 animate-spin-slow"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 border-2 border-brand-400 rounded-full opacity-10 animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/2 w-20 h-20 border-2 border-brand-500 rounded-lg rotate-12 opacity-10 animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full text-white text-sm font-semibold mb-4 animate-fade-in-up">
              ✨ BENEFITS
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-brand-600 via-brand-700 to-brand-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200 px-4">
              Why Choose Us?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400 px-4">
              Experience the advantages that set us apart from the competition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className={`group relative animate-fade-in-up animate-delay-${(index + 1) * 150}`}>
                  <div className="relative p-6 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-fade-in-scale animate-delay-300 group-hover:rotate-12 transition-transform duration-300 shadow-lg dark:shadow-2xl">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 animate-fade-in-left animate-delay-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm animate-fade-in-right animate-delay-500 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <AIParticles />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%233b82f6%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M40%2040c0-11-9-20-20-20s-20%209-20%2020%209%2020%2020%2020%2020-9%2020-20zm20%200c0-11-9-20-20-20s-20%209-20%2020%209%2020%2020%2020%2020-9%2020-20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-semibold mb-4 animate-fade-in-up">
              🔄 HOW IT WORKS
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
              Get started in minutes with our streamlined implementation process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className={`group relative text-center animate-fade-in-up animate-delay-${(index + 1) * 200}`}>
                <div className="relative">
                  {/* Connection Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-4 z-0"></div>
                  )}
                  
                  <div className="relative p-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in-scale animate-delay-300 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-2xl relative">
                        <span className="text-3xl font-bold text-white">{step.step}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-left animate-delay-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {step.title}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 animate-fade-in-right animate-delay-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    
                    <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm">
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
                <div key={index} className={`group bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-600/50 hover:shadow-lg dark:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-scale animate-delay-${(index + 1) * 100}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${industry.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300 animate-fade-in-scale animate-delay-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 animate-fade-in-left animate-delay-400">{industry.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 animate-fade-in-right animate-delay-500">
                    {industry.name === t('home.industries.healthcare') && t('home.industryUseCases.healthcare')}
                    {industry.name === t('home.industries.ecommerce') && t('home.industryUseCases.ecommerce')}
                    {industry.name === t('home.industries.realEstate') && t('home.industryUseCases.realEstate')}
                    {industry.name === t('home.industries.education') && t('home.industryUseCases.education')}
                    {industry.name === t('home.industries.automotive') && t('home.industryUseCases.automotive')}
                    {industry.name === t('home.industries.legal') && t('home.industryUseCases.legal')}
                    {industry.name === t('home.industries.restaurant') && t('home.industryUseCases.restaurant')}
                    {industry.name === t('home.industries.services') && t('home.industryUseCases.services')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* See Spark AI in Action */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <SoundWaveAnimation />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%235965f0%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-semibold mb-4 animate-fade-in-up">
              🎬 LIVE DEMOS
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200">
              See Spark AI in Action
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
              Watch our AI voice agents handle real phone calls across different industries. No scripts, no pre-recorded responses - just pure AI intelligence.
            </p>
          </div>

          {/* Main Demo Showcase */}
          <div className="mb-16">
            <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 animate-fade-in-up animate-delay-600">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Play className="w-10 h-10 ml-1" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Live AI Call Demo</h3>
                    <p className="text-white/80 mb-6">Watch our AI agent handle a real customer service call</p>
                    <Button className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-3 text-lg font-semibold">
                      <Play className="mr-2 w-5 h-5" />
                      Play Full Demo
                    </Button>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  🔴 LIVE
                </div>
              </div>
            </div>
          </div>

          {/* Demo Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: t('home.demoFeatures.customerSupport.title'),
                industry: "E-commerce",
                duration: "2:30 min",
                description: "AI agent handles order tracking, returns, and customer inquiries with natural conversation flow.",
                icon: Headphones,
                color: "from-blue-500 to-purple-500",
                features: (t('home.demoFeatures.customerSupport.features', { returnObjects: true }) as string[])
              },
              {
                title: t('home.demoFeatures.appointmentBooking.title'),
                industry: t('home.demoFeatures.appointmentBooking.industry'),
                duration: "1:45 min", 
                description: "Automated scheduling for dental clinics, beauty salons, and service providers with calendar sync.",
                icon: Calendar,
                color: "from-blue-500 to-purple-500",
                features: ["Calendar Integration", "Smart Scheduling", "Reminder Calls"]
              },
              {
                title: "Sales & Lead Generation",
                industry: "Real Estate",
                duration: "3:15 min",
                description: "AI agent qualifies leads, books appointments, and follows up with prospects automatically.",
                icon: TrendingUp,
                color: "from-blue-500 to-purple-500",
                features: ["Lead Qualification", "Follow-up Automation", "CRM Integration"]
              }
            ].map((demo, index) => {
              const Icon = demo.icon;
              return (
                <div key={index} className={`group relative animate-fade-in-up animate-delay-${(index + 1) * 200}`}>
                  <div className="relative bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-2xl p-6 shadow-lg dark:shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${demo.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-2xl`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {demo.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{demo.industry}</p>
                          </div>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {demo.duration}
                        </div>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        {demo.description}
                      </p>
                      
                      <div className="space-y-2 mb-6">
                        {demo.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <Button variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                        <Play className="mr-2 w-4 h-4" />
                        Watch Demo
                      </Button>
                    </div>
                    
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call-to-Action */}
          <div className="text-center bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white animate-fade-in-up animate-delay-800 mx-2 sm:mx-0">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">Ready to See Your AI Agent in Action?</h3>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Book a personalized demo and watch our AI handle your specific use case in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                className="group bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg dark:shadow-2xl hover:shadow-2xl border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 relative overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                  Book Live Demo
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="group border-2 border-white text-white hover:bg-white hover:text-purple-600 hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg dark:shadow-2xl hover:shadow-2xl backdrop-blur-sm bg-white/10 hover:bg-white relative overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                  Try Free Call
                </span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
            
            {/* Trust Badge */}
            <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2 text-white/80 text-xs sm:text-sm px-4">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Trusted by 500+ companies worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm">
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
              <div key={index} className={`relative bg-white dark:bg-slate-700/80 dark:backdrop-blur-sm rounded-2xl p-8 border-2 ${
                plan.popular ? 'border-blue-500' : 'border-slate-200 dark:border-slate-600/50'
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

          <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
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

              {/* Right Section - Calendly Scheduling */}
              <div className="p-8 lg:p-12">
                <CalendlyScheduling 
                  userSlug="insyncinternational" // Your Calendly username
                  eventTypeSlug="30min" // Common slug for 30 minute meetings
                  className="max-w-md mx-auto"
                />
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%235965f0%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 animate-fade-in-up">
              🏆 TRUSTED BY INDUSTRY LEADERS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200 leading-tight">
              Why top companies choose Spark AI
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400 px-4">
              Join 500+ companies that trust Spark AI to transform their customer engagement and drive unprecedented growth
            </p>
          </div>

          {/* Enhanced Comparison Table */}
          <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 animate-fade-in-up animate-delay-600 mx-2 sm:mx-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600/50 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-600">
                    <th className="text-left py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white">
                      Key Features & Benefits
                    </th>
                    <th className="text-center py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-8">
                      <div className="inline-flex items-center justify-center w-24 sm:w-32 lg:w-36 h-10 sm:h-12 lg:h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg dark:shadow-2xl">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white mr-1 sm:mr-2" />
                        <span className="text-white font-bold text-xs sm:text-sm lg:text-lg">SPARK AI</span>
                      </div>
                    </th>
                    <th className="text-center py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg font-semibold text-slate-600 dark:text-slate-400">
                      Other AI Platforms
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: 'Advanced AI Voice Technology',
                      description: 'State-of-the-art natural language processing',
                      spark: true,
                      others: false
                    },
                    {
                      feature: '24/7 Customer Support',
                      description: 'Round-the-clock availability and monitoring',
                      spark: true,
                      others: false
                    },
                    {
                      feature: 'Custom Voice Cloning',
                      description: 'Personalized brand voice creation',
                      spark: true,
                      others: false
                    },
                    {
                      feature: 'Multi-language Support',
                      description: '95+ languages with native accents',
                      spark: true,
                      others: false
                    },
                    {
                      feature: 'Real-time Analytics',
                      description: 'Comprehensive performance insights',
                      spark: true,
                      others: false
                    },
                    {
                      feature: 'Enterprise Security',
                      description: 'SOC 2 compliant with end-to-end encryption',
                      spark: true,
                      others: false
                    },
                    {
                      feature: 'Easy Integration',
                      description: 'Seamless API integration with existing systems',
                      spark: true,
                      others: false
                    },
                    {
                      feature: 'Dedicated Account Manager',
                      description: 'Personal support and optimization',
                      spark: true,
                      others: false
                    }
                  ].map((item, index) => (
                    <tr key={index} className={`border-b border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 animate-fade-in-up animate-delay-${(index + 1) * 100}`}>
                      <td className="py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
                        <div>
                          <div className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base mb-1 leading-tight">
                            {item.feature}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                            {item.description}
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
                        <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg dark:shadow-2xl">
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </td>
                      <td className="text-center py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
                        <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg dark:shadow-2xl">
                          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center animate-fade-in-up animate-delay-800">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg dark:shadow-2xl">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise Security</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-2">SOC 2 compliant with military-grade encryption</p>
            </div>
            <div className="text-center animate-fade-in-up animate-delay-900">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg dark:shadow-2xl">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">Proven Results</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-2">Average 300% increase in lead conversion rates</p>
            </div>
            <div className="text-center animate-fade-in-up animate-delay-1000 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg dark:shadow-2xl">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">5-Star Support</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-2">24/7 dedicated support with 99.9% uptime</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white animate-fade-in-up animate-delay-1100 overflow-hidden mx-2 sm:mx-0">
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 opacity-50 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight">Ready to join industry leaders?</h3>
                <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                  Experience the same AI technology that's helping Fortune 500 companies transform their customer engagement
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link href="/login">
                  <Button 
                    size="lg" 
                    className="group bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg dark:shadow-2xl hover:shadow-2xl border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 relative overflow-hidden w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Free Trial
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="group border-2 border-white text-white hover:bg-white hover:text-purple-600 hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg dark:shadow-2xl hover:shadow-2xl backdrop-blur-sm bg-white/10 hover:bg-white relative overflow-hidden w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                      Book Demo Call
                    </span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </div>
                
                {/* Trust Badge */}
                <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2 text-white/80 text-xs sm:text-sm px-4">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Trusted by 500+ companies worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your New AI Sales Team */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <VoiceWaveAnimation />
        <AIParticles />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 animate-fade-in-up">
              🤖 AI SALES TEAM
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200">
              Meet Your New AI Sales Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
              Spark AI creates intelligent voice agents that sound human, think strategically, 
              and work tirelessly to grow your business 24/7.
            </p>
          </div>

          {/* Enhanced AI Demo Call Form */}
          <div className="max-w-4xl mx-auto animate-fade-in-up animate-delay-600">
            <AIDemoCall className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/50" />
          </div>

          {/* AI Sales Team Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: '24/7 Availability',
                description: 'Your AI sales team never sleeps, works weekends, and handles holidays automatically.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Target,
                title: 'Lead Qualification',
                description: 'Intelligent lead scoring and qualification that identifies high-value prospects instantly.',
                color: 'from-cyan-500 to-teal-500'
              },
              {
                icon: TrendingUp,
                title: 'Conversion Optimization',
                description: 'Continuous learning and optimization to improve conversion rates with every call.',
                color: 'from-teal-500 to-green-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`group text-center animate-fade-in-up animate-delay-${(index + 1) * 200}`}>
                  <div className="relative p-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-2xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
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

           <div className="team-container">
             {[
               {
                 name: 'Jay Sir',
                 title: 'CEO / Founder',
                 image: '/images/JAY.png',
                 color: 'from-blue-500 to-purple-500',
                 description: 'Visionary leader driving AI innovation and business growth'
               },
               {
                 name: 'Tooba',
                 title: 'Head of AI',
                 image: '/images/Tooba.png',
                 color: 'from-blue-500 to-purple-500',
                 description: 'Leading AI strategy and machine learning implementation'
               },
               {
                 name: 'Sagar',
                 title: 'AI Strategist',
                 image: '/images/Sagar.png',
                 color: 'from-blue-500 to-purple-500',
                 description: 'Expert in AI solutions and strategic technology planning'
               },
               {
                 name: 'Ananya',
                 title: 'Project Manager',
                 image: '/images/Ananya.png',
                 color: 'from-blue-500 to-purple-500',
                 description: 'Ensuring seamless project delivery and team coordination'
               },
               {
                 name: 'Ersham',
                 title: 'Creative Head',
                 image: '/images/Ersham.png',
                 color: 'from-blue-500 to-purple-500',
                 description: 'Designing innovative user experiences and creative solutions'
               },
               {
                 name: 'Saleem',
                 title: 'HR Manager',
                 image: '/images/Saleem.png',
                 color: 'from-blue-500 to-purple-500',
                 description: 'Building and nurturing our talented team culture'
               }
             ].map((member, index) => (
               <div key={index} className="team-card group bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-600/50">
                 <div className="flex flex-col items-center justify-center text-center h-full">
                   <div className="avatar-3d w-24 h-24 rounded-2xl mb-4 shadow-lg dark:shadow-2xl group-hover:shadow-xl overflow-hidden bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm border-2 border-slate-200 dark:border-slate-600/50">
                     <img 
                       src={member.image} 
                       alt={member.name}
                       className="w-full h-full object-cover rounded-xl"
                     />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                     {member.name}
                   </h3>
                   <p className="text-blue-600 dark:text-blue-400 font-semibold text-base mb-3">
                     {member.title}
                   </p>
                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-2">
                     {member.description}
                   </p>
                 </div>
               </div>
             ))}
          </div>

          {/* Team Stats */}
          <div className="mt-16 flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
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
              <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 border border-slate-200 dark:border-slate-600/50">
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
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-6 sm:p-8 lg:p-12 text-white animate-ai-glow">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90 px-2">
              Use action-driven CTAs like 'Try for Free' or 'Book a Demo' with a short benefit (e.g., 'Save 10+ hours a week').
            </p>
            <Link href="/login">
            <Button 
              size="lg" 
              className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              Try for Free - Save 10+ Hours/Week
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm">
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
              <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600/50">
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
      <footer id="contact" className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Spark AI</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                {t('footer.companyDescription')}
              </p>
              <div className="text-slate-400 text-sm space-y-1">
                <p>📍 {t('footer.address')}</p>
                <p>📧 {t('footer.email')}</p>
                <p>📞 {t('footer.phone')}</p>
              </div>
              
              {/* Trust Elements */}
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-slate-800 rounded-lg px-3 py-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-slate-300">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800 rounded-lg px-3 py-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-slate-300">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800 rounded-lg px-3 py-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-slate-300">4.9/5 Rating</span>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4">{t('footer.product')}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#solutions" className="hover:text-white transition-colors">{t('footer.features')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('footer.pricing')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.api')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.integrations')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.voiceLibrary')}</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/about" className="hover:text-white transition-colors">{t('footer.about')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.blog')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.careers')}</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.helpCenter')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{t('footer.privacyPolicy')}</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{t('footer.termsOfService')}</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{t('footer.cookiePolicy')}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
