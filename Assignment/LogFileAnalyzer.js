const fs = require('fs');
const readline = require('readline');

class LogAnalyzer {
    constructor(logFilePath) {
        this.logFilePath = logFilePath;
        this.stats = {
            totalLines: 0,
            errorCount: 0,
            warningCount: 0,
            infoCount: 0,
            errors: [],
            timestamps: []
        };
    }

    parseLine(line) {
        const logLine = line.trim();
        if (!logLine) return null;

        if (logLine.includes('ERROR') || logLine.includes('[ERROR]') || logLine.toLowerCase().includes('error')) {
            this.stats.errorCount++;
            this.stats.errors.push(logLine);
        } else if (logLine.includes('WARN') || logLine.includes('[WARN]') || logLine.toLowerCase().includes('warning')) {
            this.stats.warningCount++;
        } else if (logLine.includes('INFO') || logLine.includes('[INFO]') || logLine.toLowerCase().includes('info')) {
            this.stats.infoCount++;
        }

        const timestampMatch = logLine.match(/\d{4}-\d{2}-\d{2}|\d{2}:\d{2}:\d{2}/);
        if (timestampMatch) {
            this.stats.timestamps.push(timestampMatch[0]);
        }

        this.stats.totalLines++;
        return logLine;
    }

    async analyze() {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(this.logFilePath, {
                encoding: 'utf8',
                highWaterMark: 64 * 1024 
            });

            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                this.parseLine(line);
            });

            rl.on('close', () => {
                resolve(this.generateReport());
            });

            readStream.on('error', (err) => {
                reject(err);
            });
        });
    }

    generateReport() {
        const report = {
            summary: {
                totalLines: this.stats.totalLines,
                errorCount: this.stats.errorCount,
                warningCount: this.stats.warningCount,
                infoCount: this.stats.infoCount,
                errorPercentage: ((this.stats.errorCount / this.stats.totalLines) * 100).toFixed(2) + '%',
                warningPercentage: ((this.stats.warningCount / this.stats.totalLines) * 100).toFixed(2) + '%'
            },
            recentErrors: this.stats.errors.slice(-10),
            timestamps: {
                first: this.stats.timestamps[0] || 'N/A',
                last: this.stats.timestamps[this.stats.timestamps.length - 1] || 'N/A'
            }
        };

        return report;
    }

    printReport(report) {
        console.log('\n' + '='.repeat(60));
        console.log('                  LOG ANALYSIS REPORT');
        console.log('='.repeat(60));
        console.log('\n--- SUMMARY STATISTICS ---');
        console.log(`Total Lines Processed: ${report.summary.totalLines}`);
        console.log(`Error Count: ${report.summary.errorCount} (${report.summary.errorPercentage})`);
        console.log(`Warning Count: ${report.summary.warningCount} (${report.summary.warningPercentage})`);
        console.log(`Info Count: ${report.summary.infoCount}`);

        console.log('\n--- TIMESTAMPS ---');
        console.log(`First Log Entry: ${report.timestamps.first}`);
        console.log(`Last Log Entry: ${report.timestamps.last}`);

        if (report.recentErrors.length > 0) {
            console.log('\n--- RECENT ERRORS (Last 10) ---');
            report.recentErrors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.substring(0, 100)}${error.length > 100 ? '...' : ''}`);
            });
        } else {
            console.log('\n--- NO ERRORS FOUND ---');
        }

        console.log('\n' + '='.repeat(60) + '\n');
    }
}


async function main() {

    const sampleLogPath = 'sample.log';
    const sampleLogs = `2025-02-03 10:00:00 [INFO] Application started
2025-02-03 10:00:05 [INFO] User logged in: user123
2025-02-03 10:01:00 [WARN] High memory usage detected: 85%
2025-02-03 10:02:30 [ERROR] Database connection failed: timeout after 30s
2025-02-03 10:02:35 [INFO] Retrying database connection...
2025-02-03 10:02:40 [INFO] Database connection established
2025-02-03 10:05:00 [ERROR] File not found: /path/to/config.json
2025-02-03 10:05:15 [WARN] Using default configuration
2025-02-03 10:10:00 [INFO] Processing batch job #12345
2025-02-03 10:15:00 [ERROR] API call failed: 500 Internal Server Error
2025-02-03 10:15:10 [INFO] Sending error notification
2025-02-03 10:20:00 [INFO] Batch job completed successfully
2025-02-03 10:25:00 [WARN] Low disk space: 15% remaining
2025-02-03 10:30:00 [ERROR] Authentication failed for user: admin
2025-02-03 10:30:05 [WARN] Multiple failed login attempts detected`;

    try {

        fs.writeFileSync(sampleLogPath, sampleLogs);
        console.log(`Sample log file created: ${sampleLogPath}\n`);


        const analyzer = new LogAnalyzer(sampleLogPath);
        const report = await analyzer.analyze();
        analyzer.printReport(report);

        fs.unlinkSync(sampleLogPath);
        console.log('Sample log file cleaned up.');

    } catch (err) {
        console.error('Error:', err.message);
    }
}

if (require.main === module) {
    main();
}

module.exports = LogAnalyzer;