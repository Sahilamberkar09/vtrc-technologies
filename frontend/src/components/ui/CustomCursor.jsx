import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const dotRef  = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        const dot  = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = 0, mouseY = 0;
        let ringX  = 0, ringY  = 0;
        let raf;

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top  = mouseY + 'px';
        };

        const animate = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            raf = requestAnimationFrame(animate);
        };

        const onEnterLink = () => ring.classList.add('hovering');
        const onLeaveLink = () => ring.classList.remove('hovering');

        window.addEventListener('mousemove', onMove);
        raf = requestAnimationFrame(animate);

        const updateLinks = () => {
            const links = document.querySelectorAll('a, button, [data-cursor]');
            links.forEach(el => {
                el.addEventListener('mouseenter', onEnterLink);
                el.addEventListener('mouseleave', onLeaveLink);
            });
        };

        updateLinks();
        // Re-run after short delay for dynamically mounted elements
        const timer = setTimeout(updateLinks, 1000);

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(raf);
            clearTimeout(timer);
        };
    }, []);

    return (
        <>
            <div ref={dotRef}  className="cursor-dot"  />
            <div ref={ringRef} className="cursor-ring" />
        </>
    );
};

export default CustomCursor;
