class SailbotNavigation extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <!-- Navigation Template -->
            <header id="header">
                <a class="logo" href="index.html">Pitt Sailbot</a>
                <nav class="horizontal-nav">
                    <ul class="nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="tree_control.html">Controls Team</a></li>
                        <li><a href="tree_mech.html">Mechanical Team</a></li>
                        <li><a href="tree_comp.html">Competition</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                        <li><a href="photos.html">Photos</a></li>
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
                    <li><a href="tree_comp.html">Competition</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                    <li><a href="photos.html">Photos</a></li>
                </ul>
            </nav>
        `;
    }
}

customElements.define('sailbot-nav', SailbotNavigation);