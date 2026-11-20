
import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

/**
 * A button component that triggers the PWA installation prompt.
 * Only renders if the app is installable and not already installed.
 */
const InstallButton = ({ minimal = false }: { minimal?: boolean }) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  // Only render the button if the app is installable and not already installed
  if (!isInstallable || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      console.log('User accepted the PWA install prompt');
    } else {
      console.log('User dismissed the PWA install prompt');
    }
  };

  if (minimal) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleInstallClick}
        className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
      >
        <Download className="h-5 w-5" />
        <span className="sr-only">Install App</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleInstallClick}
      className="text-white/80 hover:text-white bg-black/20 border-purple-500/30 hover:bg-purple-500/10"
    >
      <Download className="mr-2 h-4 w-4" />
      Install App
    </Button>
  );
};

export default InstallButton;
