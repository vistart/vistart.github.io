# Vistart's Toolbox

A comprehensive collection of utility tools built with Vue 3, TypeScript, and Vite. This project provides a toolbox of practical calculators and utilities with an internationalized interface and modern UI.

## Project Overview

The project follows a modular architecture where different tools are organized as subprojects within the `src/tools/` directory. Each tool is independently configurable and can be easily added to the toolbox.

## Subprojects/Tools

### 1. Credit Card APR Calculator (`src/tools/credit-card-apr/`)
A financial calculator that computes the actual annual percentage rate (APR) for credit card installment payments. This tool allows users to:
- Calculate APR based on principal amount, installment periods, and fee rates
- Support for different fee structures (same fees vs different fees for different periods)
- Accurate APR calculation using internal rate of return (IRR) method
- Internationalized interface with Chinese language support

## Architecture

The project uses the following technologies:
- Vue 3 with Composition API and `<script setup>` syntax
- TypeScript for type safety
- Vite as the build tool
- Element Plus UI library for components
- Vue Router for navigation
- Vue I18n for internationalization
- SCSS for styling

## Key Components

- `src/components/` - Main application layout and UI components
  - `AppLayout.vue` - Main application layout
  - `ToolboxHome.vue` - Home page displaying all tools
  - `ToolDetail.vue` - Dynamic tool detail page

- `src/tools/` - Modular tools system
  - `index.ts` - Tool registry and management
  - `types.ts` - Tool configuration interfaces
  - Individual tool directories with their components and configurations

- `src/router/` - Vue Router configuration
- `src/locales/` - Internationalization resources
- `src/utils/` - Utility functions

## Examples

The `examples/` directory contains a variety of standalone HTML examples demonstrating different concepts and tools:

### Database Examples
- `examples/database/` - Database-related examples
  - `normalization.html` - Database normalization examples

### gRPC Examples
- `examples/grpc/` - gRPC examples
  - `examples/grpc/python/` - Python gRPC examples
    - `calculator.html` - Basic gRPC calculator example
    - `calculator_enhanced.html` - Enhanced gRPC calculator example

### LLM (Large Language Model) Examples
- `examples/llm/` - LLM-related interactive examples
  - `attention_mechanism_comparison.html` - Comparison of different attention mechanisms
  - `gpt-oss-architecture-demo.html` - GPT open-source architecture demonstration
  - `trad_vs_rope_transformers.html` - Traditional vs RoPE transformers comparison
  - `transformer_demo_app.html` - Complete Transformer architecture demonstration with training and inference
  - `transformer_revolution_path.html` - Visualization of the transformer model evolution path

### Math Examples
- `examples/math/` - Mathematical calculators and visualizations
  - `mortgage-calculator.html` - Mortgage calculator with mathematical analysis of discrete vs continuous functions

### Standalone Examples
- `alpha_channel_removal.html` - Image alpha channel removal tool

## Accessing Content

This GitHub Pages site (vistart.github.io) hosts both the main application and examples:

### Main Application
The main application is available at: https://vistart.github.io/
This is the deployed Vue.js application from the `src` directory.

### Examples
The examples can be accessed directly via their URL paths:
- Database normalization: https://vistart.github.io/examples/database/normalization.html
- gRPC calculator: https://vistart.github.io/examples/grpc/python/calculator.html
- gRPC enhanced calculator: https://vistart.github.io/examples/grpc/python/calculator_enhanced.html
- Attention mechanism comparison: https://vistart.github.io/examples/llm/attention_mechanism_comparison.html
- GPT OSS architecture demo: https://vistart.github.io/examples/llm/gpt-oss-architecture-demo.html
- Traditional vs RoPE transformers: https://vistart.github.io/examples/llm/trad_vs_rope_transformers.html
- Transformer demo app: https://vistart.github.io/examples/llm/transformer_demo_app.html
- Transformer revolution path: https://vistart.github.io/examples/llm/transformer_revolution_path.html
- Mortgage calculator: https://vistart.github.io/examples/math/mortgage-calculator.html
- Alpha channel removal: https://vistart.github.io/alpha_channel_removal.html

## Features

- Modular tool architecture - easily add new tools
- Internationalization support (currently Chinese)
- Responsive design with Element Plus components
- Dynamic component loading for tools
- Clean, modern UI with consistent styling

## Development

To run the project locally:

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open your browser to the URL displayed in the console

## Adding New Tools

To add a new tool to the toolbox:
1. Create a new directory under `src/tools/`
2. Add your Vue component and configuration file
3. Register the tool in `src/tools/index.ts`
4. Add translations to the locale files if needed

Each tool follows the ToolConfig interface defined in `src/tools/types.ts`, which includes properties for ID, name, description, icon, component, and more.

This project is maintained by Vistart and is deployed at https://vistart.github.io/
