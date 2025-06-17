# Personal Portfolio Website

This is a professional portfolio website built to showcase my skills, projects, and professional experience. The site is built as a dynamic **Single Page Application (SPA)** using vanilla **HTML**, **CSS**, and **JavaScript**, and it incorporates live data from external APIs.

---

## Live Demo

You can view the website here: <https://steve3p0.github.io/Portfolio/>

---

## How to Run the Code Locally

This project is a **static website** and does not require a complex build process.

1. **Clone** the repository to your local machine.
2. Launch a simple local web server (for example, the **“Live Server”** extension in Visual Studio Code).
3. Open `index.html` in your browser.

---

## Outside Libraries, Frameworks, and Services

### Frameworks & Libraries

| Tool               | Purpose                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Bootstrap 5.3**  | Responsive grid system (e.g., course list layout), component styling (cards, forms), utility classes, etc.    |
| **Bootstrap Icons**| Iconography used throughout the site—including the navigation sidebar and card headers.                        |

### APIs & External Services

| Service                         | How it’s used                                                                                                                  |
| --------------------------------| ------------------------------------------------------------------------------------------------------------------------------ |
| **National Weather Service API**| Fetches live, real‑time weather forecasts for Portland, Oregon on the *Hobbies* page. No access key required.                  |
| **rss2json.com**                | Converts the Portland Timbers RSS feed (XML) into JSON, enabling clean fetch calls and bypassing CORS limitations.            |
| **Web3Forms**                | A backend service used to receive submissions from the contact form and forward them as an email            |

