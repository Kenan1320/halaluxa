
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				haluna: {
					primary: '#2A866A',
					'primary-light': '#e6f2ef',
					'primary-dark': '#1e5c4a',
					secondary: '#F9F5EB',
					accent: '#9b87f5',
					'accent-dark': '#7E69AB',
					'accent-light': '#E5DEFF',
					text: '#333333',
					'text-light': '#666666',
					cream: '#FFF8EB',
					beige: '#F6E6C8',
					sage: '#D4E2D4',
					purple: {
						DEFAULT: '#9b87f5',
						dark: '#7E69AB',
						light: '#E5DEFF',
						50: '#f5f2ff',
						100: '#ebe5ff',
						200: '#d6caff',
						300: '#c2b0ff',
						400: '#ad95ff',
						500: '#9b87f5',
						600: '#8e6aec',
						700: '#7E69AB',
						800: '#6E59A5',
						900: '#4c3980',
					},
					green: {
						DEFAULT: '#2A866A',
						dark: '#1e5c4a',
						light: '#e6f2ef',
						50: '#ecf8f4',
						100: '#d0ece4',
						200: '#a3dacb',
						300: '#76c7b2',
						400: '#4aae96',
						500: '#2A866A',
						600: '#1e5c4a',
						700: '#184138',
						800: '#133026',
						900: '#0e2018',
					}
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'slide-in-bottom': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'scale-out': 'scale-out 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.4s ease-out',
				'slide-out-right': 'slide-out-right 0.4s ease-out',
				'slide-in-bottom': 'slide-in-bottom 0.6s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float 8s ease-in-out infinite',
			},
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
				serif: ['Playfair Display', 'serif']
			},
			backgroundImage: {
				'gradient-haluna': 'linear-gradient(135deg, #e4f5f0 0%, #e5deff 100%)',
				'gradient-haluna-dark': 'linear-gradient(135deg, #1c2b29 0%, #2d2a3d 100%)',
				'gradient-primary': 'linear-gradient(to right, #2A866A, #9b87f5)',
				'gradient-primary-dark': 'linear-gradient(to right, #1e5c4a, #7E69AB)',
				'gradient-purple': 'linear-gradient(to right, #9b87f5, #7E69AB, #6E59A5)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
