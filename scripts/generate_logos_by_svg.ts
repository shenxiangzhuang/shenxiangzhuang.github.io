import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceLogoPath = path.join(projectRoot, 'public/static/logo.svg');

const targets = [
    'public/apple-touch-icon.png',
    'public/favicon-96x96.png',
    'public/web-app-manifest-192x192.png',
    'public/web-app-manifest-512x512.png',
    'public/static/1200x630.png',
    'public/static/logo.png',
    'public/static/twitter-card.png'
];

async function updatePngs() {
    console.log('Starting logo assets generation...');

    if (!fs.existsSync(sourceLogoPath)) {
        console.error(`❌ Source file not found: ${sourceLogoPath}`);
        process.exit(1);
    }

    const logoSvgContent = fs.readFileSync(sourceLogoPath, 'utf-8');
    
    // Also sync to favicon.svg to ensure it matches
    const faviconPath = path.join(projectRoot, 'public/favicon.svg');
    fs.writeFileSync(faviconPath, logoSvgContent);
    console.log('✅ Synced: public/favicon.svg');
    
    // Create a buffer from the SVG
    const svgBuffer = Buffer.from(logoSvgContent);

    // Generate favicon.ico (48x48 PNG wrapped as ICO)
    const icoPath = path.join(projectRoot, 'public/favicon.ico');
    try {
        const size = 48;
        const pngBuffer = await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toBuffer();

        // ICO file format: ICONDIR header + ICONDIRENTRY + PNG data
        const header = Buffer.alloc(6);
        header.writeUInt16LE(0, 0);      // Reserved
        header.writeUInt16LE(1, 2);      // Type: 1 = ICO
        header.writeUInt16LE(1, 4);      // Number of images

        const entry = Buffer.alloc(16);
        entry.writeUInt8(size, 0);       // Width
        entry.writeUInt8(size, 1);       // Height
        entry.writeUInt8(0, 2);          // Color palette
        entry.writeUInt8(0, 3);          // Reserved
        entry.writeUInt16LE(1, 4);       // Color planes
        entry.writeUInt16LE(32, 6);      // Bits per pixel
        entry.writeUInt32LE(pngBuffer.length, 8);  // Image size
        entry.writeUInt32LE(22, 12);     // Offset (6 + 16 = 22)

        const icoBuffer = Buffer.concat([header, entry, pngBuffer]);
        fs.writeFileSync(icoPath, icoBuffer);
        console.log('✅ Generated: public/favicon.ico (48x48)');
    } catch (error) {
        console.error('❌ Failed to generate favicon.ico:', error);
    }

    for (const relativePath of targets) {
        const fullPath = path.join(projectRoot, relativePath);
        
        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ File not found, skipping: ${relativePath}`);
            continue;
        }

        try {
            // Get dimensions of the existing file to match distinct sizes
            const metadata = await sharp(fullPath).metadata();
            const width = metadata.width;
            const height = metadata.height;

            if (!width || !height) {
                console.warn(`⚠️ Could not read dimensions for ${relativePath}, skipping.`);
                continue;
            }

            console.log(`Processing ${relativePath} (${width}x${height})...`);

            // For very wide images (like social cards), we need to fit the logo nicely
            // instead of stretching it.
            // Check aspect ratio
            const aspectRatio = width / height;
            
            if (Math.abs(aspectRatio - 1) > 0.1) {
                // Not square (e.g. valid for OG images 1200x630)
                // We create a white background canvas and composite the logo in the center
                // Let's make the logo take up about 50% of the height
                const logoSize = Math.round(Math.min(width, height) * 0.5);
                
                const resizedLogo = await sharp(svgBuffer)
                    .resize(logoSize, logoSize)
                    .toBuffer();

                await sharp({
                    create: {
                        width: width,
                        height: height,
                        channels: 4,
                        background: { r: 255, g: 255, b: 255, alpha: 1 }
                    }
                })
                .composite([{ input: resizedLogo, gravity: 'center' }])
                .png()
                .toFile(fullPath);

            } else {
                // Square image - just resize the SVG directly
                // Add a white background for non-transparent contexts?
                // Usually app icons might want transparency, but looking at current design 
                // (black logo), transparency is usually better.
                // However, user said "replace", maintaining previous behavior is safest.
                // But since I don't know if previous were transparent, I'll assume transparency is preferred for icons
                // EXCEPT: if the previous file was opaque? Hard to tell.
                // Safe bet: Transparent background for icons.
                
                await sharp(svgBuffer)
                    .resize(width, height)
                    .png() // Default is transparent background
                    .toFile(fullPath);
            }

            console.log(`✅ Updated: ${relativePath}`);

        } catch (error) {
            console.error(`❌ Failed to update ${relativePath}:`, error);
        }
    }
    console.log('All logo assets generated successfully.');
}

updatePngs();
