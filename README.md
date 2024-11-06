# Cookie Jar Extension

The **Cookie Jar Extension** is a browser extension that integrates the Google Gemini AI engine to analyze and manage cookies from websites. It allows users to easily delete unnecessary or invasive cookies, improving their browsing experience. This project is open-source and aims to help users manage cookies efficiently.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Integrates with Google Gemini AI to analyze website cookies.
- Enables users to delete unnecessary or invasive cookies easily.
- Open-source project with contributions welcome.

## Installation

To test the extension locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone git@github.com:msabree/cookie-jar-extension.git
   ```

2. Create a `.env` file in the project root and add your API key:
   ```
   REACT_APP_AI_API_KEY=<YOUR API KEY HERE>
   ```

3. Install dependencies and build the project:
   ```bash
   npm install
   npm run build
   ```

4. Load the unpacked extension into Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `dist` folder in your project

## Usage

1. After loading the extension, visit any website.
2. Click the extension icon that appears on the right side of the page.
3. Gemini AI will analyze the cookies on the site and suggest cookies that might be invasive.
4. Delete unnecessary cookies with a single click.

## Contributing

We welcome contributions! If you'd like to improve the extension, follow these steps:
1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or inquiries, please contact [msabree](mailto:makeen.sabree@gmail.com).

---