import os
from bs4 import BeautifulSoup

files = [
    "index.html", "about.html", "services.html",
    "contact.html", "blog.html", "download.html",
    "survey.html", "privacy.html"
]

def update_file(filename):
    if not os.path.exists(filename):
        return
        
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')

    # Side Menu
    side_links = {
        'index.html': 'nav_home',
        'about.html': 'nav_about',
        'services.html': 'nav_services',
        'download.html': 'nav_download',
        'blog.html': 'nav_blog',
        'contact.html': 'nav_contact',
        'survey.html': 'nav_survey',
        'privacy.html': 'nav_privacy'
    }
    for a in soup.select('.side-menu__nav a'):
        href = a.get('href')
        if href in side_links:
            a['data-i18n'] = side_links[href]

    # Navbar
    for a in soup.select('.navbar__links a'):
        href = a.get('href')
        if href in side_links:
            a['data-i18n'] = side_links[href]

    # Footer
    for h4 in soup.select('.footer__links h4'):
        h4['data-i18n'] = 'footer_quick'
    for h4 in soup.select('.footer__contact h4'):
        h4['data-i18n'] = 'footer_contact'
    for a in soup.select('.footer__links a'):
        href = a.get('href')
        if href in side_links:
            a['data-i18n'] = side_links[href]

    for p in soup.select('.footer__brand p'):
        p['data-i18n'] = 'footer_about'
    
    for span in soup.select('.footer__contact-item span'):
        if 'Dubai' in span.text:
            span['data-i18n'] = 'footer_addr1'
        elif 'Gazna' in span.text:
            span['data-i18n'] = 'footer_addr2'

    # Download button in nav
    for a in soup.select('.navbar__actions a.btn'):
        if 'Get the App' in a.text:
            a['data-i18n'] = 'nav_get_app'

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(str(soup))

for f in files:
    update_file(f)

print("Done")
