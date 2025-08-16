#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { build } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const paths = {
  frontend: resolve(__dirname, '..'),
  backend: resolve(__dirname, '../../Backend/travel-platform'),
  targetClasses: resolve(__dirname, '../../Backend/travel-platform/target/classes/static'),
  viteConfig: resolve(__dirname, '../vite.config.js')
};

class TravelPlatformBuilder {
  constructor() {
    this.isInteractive = process.stdout.isTTY;
  }

  log(message, color = 'white') {
    console.log(chalk[color](message));
  }

  async checkDirectories() {
    this.log('🔍 Checking directories...', 'blue');
    
    // Check if Spring Boot project exists
    if (!await fs.pathExists(paths.backend)) {
      this.log(`❌ Spring Boot project not found at: ${paths.backend}`, 'red');
      this.log('Please ensure the backend project exists and Maven has been run at least once.', 'yellow');
      process.exit(1);
    }

    // Check if target directory exists, create if not
    if (!await fs.pathExists(resolve(paths.backend, 'target'))) {
      this.log('📁 Creating target directory...', 'yellow');
      this.log('💡 Run "mvn compile" in backend to create target directory first', 'gray');
      await fs.ensureDir(resolve(paths.backend, 'target/classes'));
    }

    // Ensure static directory exists
    await fs.ensureDir(paths.targetClasses);
    this.log('✅ Directories checked', 'green');
  }

  async checkRequiredFiles() {
    const requiredFiles = [
      resolve(paths.frontend, 'src/main.jsx'),
      resolve(paths.frontend, 'public/index.html')
    ];

    for (const file of requiredFiles) {
      if (!await fs.pathExists(file)) {
        this.log(`❌ Required file missing: ${file}`, 'red');
        process.exit(1);
      }
    }
  }

  async cleanTargetStatic() {
    this.log('🧹 Cleaning target/classes/static directory...', 'yellow');
    
    try {
      if (await fs.pathExists(paths.targetClasses)) {
        await fs.remove(paths.targetClasses);
      }
      await fs.ensureDir(paths.targetClasses);
      
      this.log('✅ Target directory cleaned', 'green');
    } catch (error) {
      this.log(`❌ Failed to clean target directory: ${error.message}`, 'red');
      throw error;
    }
  }

  async buildWithVite() {
    this.log('🏗️  Building React app with Vite...', 'blue');
    this.log(`📁 Output directory: ${paths.targetClasses}`, 'gray');
    
    try {
      // Set production environment
      process.env.NODE_ENV = 'production';
      process.env.BABEL_ENV = 'production';
      
      // Build with Vite (outputs directly to target/classes/static)
      await build({
        configFile: paths.viteConfig,
        mode: 'production'
      });
      
      this.log('✅ Vite build completed successfully', 'green');
    } catch (error) {
      this.log(`❌ Build failed: ${error.message}`, 'red');
      throw error;
    }
  }

  async generateManifest() {
    this.log('📋 Generating build manifest...', 'yellow');
    
    try {
      const manifest = {
        buildTime: new Date().toISOString(),
        nodeVersion: process.version,
        environment: 'production',
        files: await this.getFileList(paths.targetClasses)
      };

      await fs.writeJson(resolve(paths.targetClasses, 'build-manifest.json'), manifest, { spaces: 2 });
      this.log('✅ Build manifest generated', 'green');
    } catch (error) {
      this.log(`⚠️  Failed to generate manifest: ${error.message}`, 'yellow');
    }
  }

  async getFileList(dir, prefix = '') {
    const files = [];
    
    try {
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = resolve(dir, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          const subFiles = await this.getFileList(fullPath, `${prefix}${item}/`);
          files.push(...subFiles);
        } else {
          files.push(`${prefix}${item}`);
        }
      }
    } catch (error) {
      // Ignore errors in file listing
    }
    
    return files;
  }

  async printBuildResults() {
    this.log('\n🎉 Build completed successfully!', 'green');
    this.log('\n📦 Files deployed to Spring Boot target/classes/static:', 'cyan');
    
    try {
      const files = await this.getFileList(paths.targetClasses);
      files.slice(0, 10).forEach(file => {
        this.log(`  ${file}`, 'gray');
      });
      
      if (files.length > 10) {
        this.log(`  ... and ${files.length - 10} more files`, 'gray');
      }
      
      this.log(`\n📂 Total files: ${files.length}`, 'cyan');
    } catch (error) {
      // Ignore file listing errors
    }
    
    this.log('\n🚀 Next steps:', 'cyan');
    this.log('  1. Start Spring Boot: cd Backend/travel-platform && mvn spring-boot:run', 'yellow');
    this.log('  2. Access app at: http://localhost:8080', 'yellow');
    this.log('  3. React chunks will be served automatically!', 'green');
  }

  async run() {
    try {
      this.log('🚀 Starting Travel Platform build process...', 'blue');
      this.log(`📍 Frontend: ${paths.frontend}`, 'gray');
      this.log(`📍 Backend: ${paths.backend}`, 'gray');
      this.log(`📍 Target: ${paths.targetClasses}`, 'gray');
      
      await this.checkDirectories();
      await this.checkRequiredFiles();
      await this.cleanTargetStatic();
      await this.buildWithVite();
      await this.generateManifest();
      await this.printBuildResults();
      
    } catch (error) {
      this.log(`\n💥 Build failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', err => {
  throw err;
});

// Run the build
const builder = new TravelPlatformBuilder();
builder.run();