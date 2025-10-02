# AI Voice Caller Frontend

A modern, multilingual React frontend application for AI-powered voice calling system with comprehensive translation support and dynamic currency switching.

## 🌟 Features

- **🌍 Multi-Language Support**: English, Turkish, Azerbaijani, Arabic
- **💰 Dynamic Currency Switching**: USD, TRY, AZN, AED with automatic conversion
- **🎨 Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **📱 Responsive Design**: Works perfectly on all devices
- **🔄 Real-Time Translations**: Instant language switching across the entire app
- **💬 Interactive Chat Bot**: Multilingual support with language-aware responses
- **🎯 High-Converting Landing Page**: Optimized for conversions with exit-intent popups
- **🎪 Animated Components**: Engaging animations and transitions
- **🌙 Dark/Light Theme**: Automatic theme switching
- **📊 Analytics Ready**: Built-in analytics and tracking components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download this frontend project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 Language Support

The application supports 4 languages with automatic currency switching:

| Language | Code | Currency | Flag |
|----------|------|----------|------|
| English | `en` | USD | 🇺🇸 |
| Turkish | `tr` | TRY | 🇹🇷 |
| Azerbaijani | `az` | AZN | 🇦🇿 |
| Arabic | `ar` | AED | 🇦🇪 |

## 🎨 Key Components

### Core Components
- **Navigation**: Multi-language navigation with currency switcher
- **Home Page**: High-converting landing page with all sections translated
- **Chat Widget**: Interactive multilingual chat bot
- **Exit Intent Popup**: Conversion-optimized popup with translations
- **Currency Switcher**: Dynamic currency conversion
- **Language Switcher**: Instant language switching

### UI Components
- **Shadcn UI**: Complete component library
- **Animated Logo**: Custom animated phone/voice effect logo
- **Theme Toggle**: Dark/light mode switching
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── navigation.tsx  # Main navigation
│   ├── logo.tsx        # Animated logo
│   └── ...
├── pages/              # Page components
│   ├── home.tsx        # Landing page
│   ├── dashboard.tsx   # Dashboard
│   └── ...
├── locales/            # Translation files
│   ├── en.json         # English translations
│   ├── tr.json         # Turkish translations
│   ├── az.json         # Azerbaijani translations
│   └── ar.json         # Arabic translations
├── contexts/           # React contexts
│   └── currency-context.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=AI Voice Caller
```

### API Integration

The frontend is configured to work with the AI Voice Caller backend API. Update the API URL in:
- `src/lib/api.ts`
- Environment variables

## 🎯 Key Features Explained

### Translation System
- **i18next**: Industry-standard internationalization
- **Automatic Language Detection**: Detects user's browser language
- **Real-time Switching**: Instant language changes without page reload
- **Complete Coverage**: Every text element is translated

### Currency System
- **Automatic Currency Selection**: Currency changes with language
- **Real-time Conversion**: Dynamic price conversion
- **Multi-currency Support**: USD, TRY, AZN, AED
- **Context-based Management**: Global currency state

### Chat Bot
- **Multilingual Responses**: Bot responds in selected language
- **Quick Replies**: Pre-defined responses in all languages
- **Language-aware Logic**: Different responses based on language
- **Interactive Interface**: Modern chat UI with animations

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

## 🔗 Backend Integration

This frontend is designed to work with the AI Voice Caller backend. Key integration points:

- **Authentication**: User login/signup
- **Campaign Management**: Create and manage campaigns
- **Voice Selection**: Choose AI voices
- **Analytics**: View call analytics and reports
- **API Calls**: All API calls are configured in `src/lib/api.ts`

## 📱 Mobile Support

- **Responsive Design**: Works on all screen sizes
- **Touch-friendly**: Optimized for mobile interactions
- **Progressive Web App**: Can be installed on mobile devices
- **Fast Loading**: Optimized for mobile performance

## 🎨 Customization

### Adding New Languages

1. Create new translation file in `src/locales/`
2. Add language to `src/lib/i18n.ts`
3. Update `src/components/language-switcher.tsx`
4. Add currency mapping in `src/contexts/currency-context.tsx`

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Additional styles in `src/index.css`
- **Theme System**: Dark/light mode support
- **Component Styling**: Scoped component styles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue for bugs
- Contact the development team

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
