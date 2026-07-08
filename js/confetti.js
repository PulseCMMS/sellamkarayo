// js/confetti.js
const Confetti = (function () {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    
    let ctx = canvas.getContext('2d');
    let pieces = [];
    let animationId = null;

    function createPiece() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            rotation: Math.random() * 0.2 - 0.1
        };
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach((p, i) => {
            p.y += p.speed;
            p.angle += p.rotation;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            ctx.restore();

            if (p.y > canvas.height) pieces[i] = createPiece();
        });
        animationId = requestAnimationFrame(update);
    }

    return {
        start: function() {
            document.body.appendChild(canvas);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            pieces = Array.from({ length: 150 }, createPiece);
            update();
            setTimeout(() => this.stop(), 5000); // Stop after 5s
        },
        stop: function() {
            cancelAnimationFrame(animationId);
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
    };
})();
