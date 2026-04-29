export function spawnHitmarker(x: number, y: number) {
    if (typeof window === 'undefined') return;

    const size = 24;
    const marker = document.createElement('div');
    
    marker.style.position = 'fixed';
    marker.style.left = `${x - size / 2}px`;
    marker.style.top = `${y - size / 2}px`;
    marker.style.width = `${size}px`;
    marker.style.height = `${size}px`;
    marker.style.pointerEvents = 'none';
    marker.style.zIndex = '9999';
    
    // Classic 2D hitmarker X using SVG
    marker.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>')`;
    marker.style.backgroundSize = 'contain';
    marker.style.backgroundRepeat = 'no-repeat';
    marker.style.backgroundPosition = 'center';
    
    // Hitmarker initial state
    marker.style.transform = 'scale(0.5)';
    marker.style.opacity = '1';
    marker.style.transition = 'transform 0.05s ease-out, opacity 0.2s ease-in 0.1s';
    
    // Drop shadow for visibility on bright backgrounds
    marker.style.filter = 'drop-shadow(0px 0px 2px rgba(0,0,0,1))';

    document.body.appendChild(marker);

    // Trigger animation
    requestAnimationFrame(() => {
        marker.style.transform = 'scale(1.2)';
        marker.style.opacity = '0';
    });

    // Cleanup
    setTimeout(() => {
        marker.remove();
    }, 300);
}
