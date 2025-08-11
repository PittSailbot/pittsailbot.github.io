class SailbotFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
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
                                <script src="https://kit.fontawesome.com/dbf179c885.js" crossorigin="anonymous"></script>
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
}

customElements.define('sailbot-footer', SailbotFooter);