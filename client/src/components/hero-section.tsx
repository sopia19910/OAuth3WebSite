import { Button } from "@/components/ui/button";
import { Shield, Play } from "lucide-react";
import { useState, useEffect } from "react";
import logoImage from "@assets/image_1752117480535.png";
import googleLogo from "@assets/image_1752137026323.png";
import facebookLogo from "@assets/image_1752144869558.png";
import chatIcon from "@assets/image_1752148691176.png";
import networkIcon from "@assets/image_1752148793381.png";

interface ParticlePosition {
  top: number;
  left: number;
  size: number;
  opacity: number;
  delay: number;
}

export default function HeroSection() {
  const [particlePositions, setParticlePositions] = useState<ParticlePosition[]>([]);

  const particles = [
    { icon: googleLogo, alt: "Google", baseSize: 8 },
    { icon: facebookLogo, alt: "Facebook", baseSize: 6 },
    { icon: googleLogo, alt: "Google", baseSize: 6 },
    { icon: facebookLogo, alt: "Facebook", baseSize: 5 },
    { icon: googleLogo, alt: "Google", baseSize: 5 },
    { icon: chatIcon, alt: "Chat", baseSize: 8 },
    { icon: chatIcon, alt: "Chat", baseSize: 6 },
    { icon: networkIcon, alt: "Network", baseSize: 5 },
    { icon: networkIcon, alt: "Network", baseSize: 6 },
    { icon: networkIcon, alt: "Network", baseSize: 5 },
  ];

  useEffect(() => {
    const generatePositions = () => {
      const positions: ParticlePosition[] = [];
      const centerX = 50; // 50% from left
      const centerY = 50; // 50% from top
      const minRadius = 25; // Minimum distance from center
      const maxRadius = 45; // Maximum distance from center
      const minDistance = 12; // Minimum distance between particles

      for (let i = 0; i < particles.length; i++) {
        let attempts = 0;
        let validPosition = false;
        let newPosition: ParticlePosition;

        while (!validPosition && attempts < 50) {
          // Generate random angle and radius
          const angle = Math.random() * 2 * Math.PI;
          const radius = minRadius + Math.random() * (maxRadius - minRadius);
          
          // Convert to x, y coordinates
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Ensure position is within bounds
          if (x >= 5 && x <= 95 && y >= 5 && y <= 95) {
            newPosition = {
              top: y,
              left: x,
              size: particles[i].baseSize + Math.random() * 4, // Add some size variation
              opacity: 0.3 + Math.random() * 0.3, // Random opacity between 0.3-0.6
              delay: Math.random() * 4, // Random delay 0-4s
            };

            // Check if this position is too close to existing particles
            const tooClose = positions.some(pos => {
              const distance = Math.sqrt(
                Math.pow(pos.left - newPosition.left, 2) + 
                Math.pow(pos.top - newPosition.top, 2)
              );
              return distance < minDistance;
            });

            if (!tooClose) {
              positions.push(newPosition);
              validPosition = true;
            }
          }
          attempts++;
        }

        // If we couldn't find a valid position, use a fallback
        if (!validPosition) {
          const fallbackAngle = (i / particles.length) * 2 * Math.PI;
          positions.push({
            top: centerY + Math.cos(fallbackAngle) * 35,
            left: centerX + Math.sin(fallbackAngle) * 35,
            size: particles[i].baseSize,
            opacity: 0.4,
            delay: i * 0.5,
          });
        }
      }

      setParticlePositions(positions);
    };

    generatePositions();
  }, []);
  return (
    <section id="home" className="pt-16 gradient-bg text-white min-h-screen flex items-center tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight clean-title">
              <span className="clean-logo">OAuth 3</span><br />
              The Future of{" "}
              <span className="text-primary">Hybrid Authentication</span>
            </h1>
            <p className="text-lg text-foreground/80 tech-body">
              Combining the intuitive convenience of Web2 with the robust security of Web3. 
              Experience next-generation authentication that bridges traditional and blockchain ecosystems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold animate-pulse-glow"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 font-semibold"
              >
                <Play className="mr-2 h-4 w-4" />
                View Demo
              </Button>
            </div>
          </div>
          <div className="flex justify-center relative">
            <div className="animate-float">
              <div className="w-80 h-80 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 animate-pulse-glow">
                <img src={logoImage} alt="OAuth 3 Logo" className="w-32 h-32 opacity-90" />
              </div>
            </div>
            
            {/* Floating particles - dynamically positioned around the large circle */}
            {particlePositions.map((position, index) => (
              <div
                key={index}
                className="absolute rounded-full animate-particle flex items-center justify-center bg-white/10 backdrop-blur-sm"
                style={{
                  top: `${position.top}%`,
                  left: `${position.left}%`,
                  width: `${position.size * 4}px`,
                  height: `${position.size * 4}px`,
                  opacity: position.opacity,
                  animationDelay: `${position.delay}s`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <img 
                  src={particles[index].icon} 
                  alt={particles[index].alt} 
                  className="opacity-90"
                  style={{
                    width: `${position.size * 4}px`,
                    height: `${position.size * 4}px`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
