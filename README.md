
# Conservation of Architectural Heritage

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/karadagi/Conservation_Architectural_Heritage)

Implementing a generative framework for the restitution of historical buildings through a two-stage Pix2Pix (cGAN) architecture, facilitating transitions from incomplete ruins to restored architectural forms.

**Live Model Interface:** [karadagi.github.io/Conservation_Architectural_Heritage](https://karadagi.github.io/Conservation_Architectural_Heritage/)

## Local Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed on your system.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karadagi/Conservation_Architectural_Heritage.git
   cd Conservation_Architectural_Heritage
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Academic Reference

The model logic and dataset configuration are documented in the following research publication:

**Citation:**
> Karadag, I. (2023). Machine learning for conservation of architectural heritage. *Open House International*, 48(1), 23-37. [https://doi.org/10.1108/OHI-05-2022-0124](https://doi.org/10.1108/OHI-05-2022-0124)

### Abstract
The accurate documentation of damaged or destroyed historical buildings is a critical issue for cultural heritage protection. This study employs machine learning (ML) to address this by predicting missing or damaged parts of historical buildings, specifically focusing on early Ottoman tombs. The approach utilizes conditional generative adversarial networks (cGANs) to efficiently estimate these missing sections based on a dataset of nearly 200 historical building plan drawings.

The two-step synthesis enables the identification and regeneration of architectural components like walls, domes, and tromps, validating the effectiveness of ML in the restitution of architectural heritage.
