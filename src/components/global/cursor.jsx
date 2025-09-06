/* eslint-disable react/prop-types */
import { Children, useState, useEffect } from "react";
import { cn } from "../../lib/util";

export const Cursor = ({ className, children, ...props }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Aggressive cursor hiding function
    const forceCursorHidden = () => {
      // Inline styles with highest priority
      document.body.style.setProperty('cursor', 'none', 'important');
      document.documentElement.style.setProperty('cursor', 'none', 'important');
      
      // Apply to all elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.setProperty('cursor', 'none', 'important');
      });
    };

    // Inject CSS with maximum specificity
    const injectCursorCSS = () => {
      const existingStyle = document.getElementById('custom-cursor-override');
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = document.createElement('style');
      style.id = 'custom-cursor-override';
      style.textContent = `
        * { cursor: none !important; }
        *:hover { cursor: none !important; }
        *:focus { cursor: none !important; }
        *:active { cursor: none !important; }
        html { cursor: none !important; }
        body { cursor: none !important; }
        a, button, input, textarea, select { cursor: none !important; }
        [role="button"] { cursor: none !important; }
      `;
      document.head.appendChild(style);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsVisible(true);
        setTimeout(() => {
          forceCursorHidden();
          injectCursorCSS();
        }, 10);
      } else {
        setIsVisible(false);
      }
    };

    const handleWindowFocus = () => {
      setIsVisible(true);
      setTimeout(() => {
        forceCursorHidden();
        injectCursorCSS();
      }, 10);
    };

    const handleWindowBlur = () => {
      setIsVisible(false);
    };

    // MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      forceCursorHidden();
    });

    // Periodic enforcement
    const cursorInterval = setInterval(() => {
      forceCursorHidden();
    }, 100);

    // Add all event listeners
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    // Initial setup
    injectCursorCSS();
    forceCursorHidden();
    
    // Start observing DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      
      clearInterval(cursorInterval);
      observer.disconnect();
      
      const injectedStyle = document.getElementById('custom-cursor-override');
      if (injectedStyle) {
        injectedStyle.remove();
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[9999] select-none transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-2px, -2px)'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CursorPointer = ({ className, ...props }) => (
  <svg
    aria-hidden="true"
    className={cn("size-6 text-slate-900 dark:text-slate-100 drop-shadow-lg filter", className)}
    fill="none"
    focusable="false"
    height="24"
    viewBox="0 0 20 20"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.438 6.716 1.115.05A.832.832 0 0 0 .05 1.116L6.712 19.45a.834.834 0 0 0 1.557.025l3.198-8 7.995-3.2a.833.833 0 0 0 0-1.559h-.024Z"
      fill="currentColor"
    />
  </svg>
);

export const CursorBody = ({ children, className, ...props }) => (
  <span
    className={cn(
      "relative ml-3.5 flex flex-col whitespace-nowrap rounded-xl py-1 pr-3 pl-2.5 text-xs",
      Children.count(children) > 1 && "rounded-tl [&>:first-child]:opacity-70",
      "bg-secondary text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export const CursorName = (props) => <span {...props} />;

export const CursorMessage = (props) => <span {...props} />;
