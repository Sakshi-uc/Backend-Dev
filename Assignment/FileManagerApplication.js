const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

class FileManager {
    async readFile(filepath) {
        try {
            const data = await fs.readFile(filepath, 'utf8');
            console.log('\n--- File Content ---');
            console.log(data);
            console.log('--------------------\n');
        } catch (err) {
            console.error(`Error reading file: ${err.message}`);
        }
    }

    async writeFile(filepath, content) {
        try {
            await fs.writeFile(filepath, content, 'utf8');
            console.log(`File written successfully to ${filepath}\n`);
        } catch (err) {
            console.error(`Error writing file: ${err.message}`);
        }
    }

    async copyFile(source, destination) {
        try {
            await fs.copyFile(source, destination);
            console.log(`File copied successfully from ${source} to ${destination}\n`);
        } catch (err) {
            console.error(`Error copying file: ${err.message}`);
        }
    }

    async deleteFile(filepath) {
        try {
            await fs.unlink(filepath);
            console.log(`File deleted successfully: ${filepath}\n`);
        } catch (err) {
            console.error(`Error deleting file: ${err.message}`);
        }
    }

    async listDirectory(dirpath) {
        try {
            const files = await fs.readdir(dirpath);
            console.log(`\n--- Contents of ${dirpath} ---`);
            for (const file of files) {
                const filepath = path.join(dirpath, file);
                const stats = await fs.stat(filepath);
                const type = stats.isDirectory() ? 'DIR' : 'FILE';
                console.log(`[${type}] ${file}`);
            }
            console.log('--------------------\n');
        } catch (err) {
            console.error(`Error listing directory: ${err.message}`);
        }
    }

    async showMenu() {
        console.log('=== File Manager Application ===');
        console.log('1. Read File');
        console.log('2. Write File');
        console.log('3. Copy File');
        console.log('4. Delete File');
        console.log('5. List Directory Contents');
        console.log('6. Exit');
        console.log('================================\n');
    }

    async run() {
        let running = true;

        while (running) {
            await this.showMenu();
            const choice = await question('Enter your choice (1-6): ');

            switch (choice.trim()) {
                case '1':
                    const readPath = await question('Enter file path to read: ');
                    await this.readFile(readPath.trim());
                    break;

                case '2':
                    const writePath = await question('Enter file path to write: ');
                    const content = await question('Enter content to write: ');
                    await this.writeFile(writePath.trim(), content);
                    break;

                case '3':
                    const sourcePath = await question('Enter source file path: ');
                    const destPath = await question('Enter destination file path: ');
                    await this.copyFile(sourcePath.trim(), destPath.trim());
                    break;

                case '4':
                    const deletePath = await question('Enter file path to delete: ');
                    const confirm = await question('Are you sure? (yes/no): ');
                    if (confirm.toLowerCase() === 'yes') {
                        await this.deleteFile(deletePath.trim());
                    } else {
                        console.log('Delete operation cancelled.\n');
                    }
                    break;

                case '5':
                    const dirPath = await question('Enter directory path: ');
                    await this.listDirectory(dirPath.trim());
                    break;

                case '6':
                    console.log('Exiting File Manager...');
                    running = false;
                    break;

                default:
                    console.log('Invalid choice. Please try again.\n');
            }
        }

        rl.close();
    }
}

const fileManager = new FileManager();
fileManager.run();