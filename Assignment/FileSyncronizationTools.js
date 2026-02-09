const fs = require('fs').promises;
const path = require('path');

class FileSyncTool {
    constructor(sourceDir, targetDir) {
        this.sourceDir = sourceDir;
        this.targetDir = targetDir;
        this.syncReport = {
            filesChecked: 0,
            filesCopied: 0,
            filesUpdated: 0,
            filesDeleted: 0,
            errors: []
        };
    }

    async ensureDirectoryExists(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
    }

    async getFileHash(filepath) {
        try {
            const stats = await fs.stat(filepath);
            return `${stats.size}-${stats.mtime.getTime()}`;
        } catch (err) {
            return null;
        }
    }

    async compareFiles(sourceFile, targetFile) {
        const sourceHash = await this.getFileHash(sourceFile);
        const targetHash = await this.getFileHash(targetFile);
        return sourceHash === targetHash;
    }

    async getFilesRecursively(dir, fileList = []) {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                    await this.getFilesRecursively(fullPath, fileList);
                } else {
                    fileList.push(fullPath);
                }
            }

            return fileList;
        } catch (err) {
            this.syncReport.errors.push({
                operation: 'getFilesRecursively',
                path: dir,
                error: err.message
            });
            return fileList;
        }
    }

    async copyFileWithRetry(source, target, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await fs.copyFile(source, target);
                return true;
            } catch (err) {
                if (attempt === maxRetries) {
                    this.syncReport.errors.push({
                        operation: 'copy',
                        source,
                        target,
                        error: err.message
                    });
                    return false;
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    async synchronize() {
        console.log('Starting synchronization...');
        console.log(`Source: ${this.sourceDir}`);
        console.log(`Target: ${this.targetDir}\n`);

        try {
            await this.ensureDirectoryExists(this.targetDir);

            const sourceFiles = await this.getFilesRecursively(this.sourceDir);
            console.log(`Found ${sourceFiles.length} files in source directory\n`);

            for (const sourceFile of sourceFiles) {
                this.syncReport.filesChecked++;
                
                const relativePath = path.relative(this.sourceDir, sourceFile);
                const targetFile = path.join(this.targetDir, relativePath);
                const targetFileDir = path.dirname(targetFile);

                await this.ensureDirectoryExists(targetFileDir);

                try {
                    await fs.access(targetFile);
                    
                    const filesMatch = await this.compareFiles(sourceFile, targetFile);
                    
                    if (!filesMatch) {
                        console.log(`Updating: ${relativePath}`);
                        const success = await this.copyFileWithRetry(sourceFile, targetFile);
                        if (success) {
                            this.syncReport.filesUpdated++;
                        }
                    } else {
                        console.log(`Skipping (already in sync): ${relativePath}`);
                    }
                    
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        console.log(`Copying new file: ${relativePath}`);
                        const success = await this.copyFileWithRetry(sourceFile, targetFile);
                        if (success) {
                            this.syncReport.filesCopied++;
                        }
                    } else {
                        this.syncReport.errors.push({
                            operation: 'access',
                            path: targetFile,
                            error: err.message
                        });
                    }
                }
            }

            await this.removeExtraFiles();

            return this.generateReport();

        } catch (err) {
            this.syncReport.errors.push({
                operation: 'synchronize',
                error: err.message
            });
            throw err;
        }
    }

    async removeExtraFiles() {
        try {
            const targetFiles = await this.getFilesRecursively(this.targetDir);
            
            for (const targetFile of targetFiles) {
                const relativePath = path.relative(this.targetDir, targetFile);
                const sourceFile = path.join(this.sourceDir, relativePath);

                try {
                    await fs.access(sourceFile);
                } catch (err) {
                    if (err.code === 'ENOENT') {
                       
                        console.log(`Removing extra file: ${relativePath}`);
                        try {
                            await fs.unlink(targetFile);
                            this.syncReport.filesDeleted++;
                        } catch (deleteErr) {
                            this.syncReport.errors.push({
                                operation: 'delete',
                                path: targetFile,
                                error: deleteErr.message
                            });
                        }
                    }
                }
            }
        } catch (err) {
            this.syncReport.errors.push({
                operation: 'removeExtraFiles',
                error: err.message
            });
        }
    }

    generateReport() {
        return {
            ...this.syncReport,
            success: this.syncReport.errors.length === 0
        };
    }

    printReport(report) {
        console.log('\n' + '='.repeat(60));
        console.log('              SYNCHRONIZATION REPORT');
        console.log('='.repeat(60));
        console.log(`Files Checked: ${report.filesChecked}`);
        console.log(`Files Copied: ${report.filesCopied}`);
        console.log(`Files Updated: ${report.filesUpdated}`);
        console.log(`Files Deleted: ${report.filesDeleted}`);
        console.log(`Errors: ${report.errors.length}`);

        if (report.errors.length > 0) {
            console.log('\n--- ERRORS ---');
            report.errors.forEach((error, index) => {
                console.log(`${index + 1}. [${error.operation}] ${error.path || ''}`);
                console.log(`   ${error.error}`);
            });
        }

        console.log('\n' + '='.repeat(60) + '\n');
        
        if (report.success) {
            console.log('✓ Synchronization completed successfully!');
        } else {
            console.log('⚠ Synchronization completed with errors.');
        }
    }
}

async function main() {
    const sourceDir = './test-source';
    const targetDir = './test-target';

    try {
        
        await fs.mkdir(sourceDir, { recursive: true });
        await fs.mkdir(path.join(sourceDir, 'subdir'), { recursive: true });
        
        await fs.writeFile(path.join(sourceDir, 'file1.txt'), 'This is file 1');
        await fs.writeFile(path.join(sourceDir, 'file2.txt'), 'This is file 2');
        await fs.writeFile(path.join(sourceDir, 'subdir', 'file3.txt'), 'This is file 3 in subdirectory');

        console.log('Test files created in source directory\n');

        const syncTool = new FileSyncTool(sourceDir, targetDir);
        const report = await syncTool.synchronize();
        syncTool.printReport(report);

        
        await fs.rm(sourceDir, { recursive: true, force: true });
        await fs.rm(targetDir, { recursive: true, force: true });
        console.log('\nTest directories cleaned up.');

    } catch (err) {
        console.error('Error:', err.message);
    }
}


if (require.main === module) {
    main();
}

module.exports = FileSyncTool;