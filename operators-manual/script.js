window.addEventListener("load", function() {
    requestAnimationFrame(function render() {
        var hadCurrent = false;

        document.querySelectorAll(".contents a").forEach(function(contentsLink) {
            var heading = document.getElementById(contentsLink.href.split("#")[1]);

            if (!heading) {
                return;
            }

            if (!hadCurrent && heading.getBoundingClientRect().top > 0) {
                contentsLink.ariaCurrent = true;
                hadCurrent = true;
            } else {
                contentsLink.ariaCurrent = false;
            }
        });

        requestAnimationFrame(render);
    });

    document.querySelectorAll(".contents a").forEach(function(contentsLink) {
        contentsLink.addEventListener("click", function() {
            setTimeout(function() {
                window.scrollBy(0, -16);
            });
        });
    });
});