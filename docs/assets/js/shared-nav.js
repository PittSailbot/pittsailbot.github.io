document.addEventListener('DOMContentLoaded', function() {
    // Handle Navigation
    const navContainer = document.getElementById('shared-nav-container');
    if (navContainer) {
        navContainer.innerHTML = `
            <!-- Navigation Template -->
            <header id="header">
                <a class="logo" href="index.html">Pitt Sailbot</a>
                <nav class="horizontal-nav">
                    <ul class="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="tree_control.html">Controls Team</a></li>
                        <li><a href="tree_mech.html">Mechanical Team</a></li>
                        <!-- <li><a href="tree_comp.html">Competition</a></li> -->
                        <li><a href="contact.html">Contact Us</a></li>
                        <li><a href="photos.html">Gallery</a></li>
                        <li><a href="docs/index.html">Docs</a></li>
                    </ul>
                </nav>
                <nav class="mobile-menu-trigger">
                    <a href="#menu">Menu</a>
                </nav>
            </header>

            <!-- Mobile Nav (keeping original for mobile fallback) -->
            <nav id="menu" style="display: none;">
                <ul class="links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="tree_control.html">Controls Team</a></li>
                    <li><a href="tree_mech.html">Mechanical Team</a></li>
                    <!-- <li><a href="tree_comp.html">Competition</a></li> -->
                    <li><a href="contact.html">Contact Us</a></li>
                    <li><a href="photos.html">Gallery</a></li>
                    <li><a href="docs/index.html">Docs</a></li>
                </ul>
            </nav>
        `;
    }

    // Handle Footer
    const footerContainer = document.getElementById('shared-footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <!-- Footer -->
            <footer id="footer">
                <div class="inner">
                    <div class="content">
                        <section>
                            <h3>In summary...</h3>
                            <p>you should join sailbot</p>
                        </section>
                        <section>
                            <h3>Follow us!</h3>
                            <ul class="plain">
                                <li><a href="https://www.instagram.com/sailbot_pitt/"><i class="fa-brands fa-instagram" style="color: #ffffff;">
                                &nbsp;</i>Instagram</a></li>
                                <li><a href="https://github.com/PittSailbot/SailBot"><i class="fa-brands fa-github" style="color: #ffffff;">
                                &nbsp;</i>Github</a></li>
                                <li><a href="https://discord.gg/aXjgDjDAAG"><i class="fa-brands fa-discord" style="color: #ffffff;">
                                &nbsp;</i>Discord</a></li>
                            </ul>
                        </section>
                    </div>
                </div>
            </footer>
        `;
    }
});