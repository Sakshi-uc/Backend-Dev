const os = require('os');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'system-info.log');

function getSystemInfo() {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);
    
    return {
        timestamp: new Date().toISOString(),
        platform: os.platform(),
        architecture: os.arch(),
        hostname: os.hostname(),
        uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
        cpu: {
            model: cpus[0].model,
            cores: cpus.length,
            speed: `${cpus[0].speed} MHz`
        },
        memory: {
            total: `${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
            free: `${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
            used: `${(usedMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
            usagePercent: `${memoryUsagePercent}%`
        },
        loadAverage: os.loadavg()
    };
}

function logSystemInfo() {
    const info = getSystemInfo();
    const logEntry = `
========================================
${info.timestamp}
========================================
Platform: ${info.platform}
Architecture: ${info.architecture}
Hostname: ${info.hostname}
Uptime: ${info.uptime}

CPU:
  Model: ${info.cpu.model}
  Cores: ${info.cpu.cores}
  Speed: ${info.cpu.speed}

Memory:
  Total: ${info.memory.total}
  Used: ${info.memory.used}
  Free: ${info.memory.free}
  Usage: ${info.memory.usagePercent}

Load Average: ${info.loadAverage.join(', ')}

`;

    fs.appendFile(logFile, logEntry, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        } else {
            console.log(`✓ System info logged at ${info.timestamp}`);
        }
    });
}

console.log(`Starting system information logger...`);
console.log(`Log file: ${logFile}`);
console.log(`Logging every 5 seconds. Press Ctrl+C to stop.\n`);

logSystemInfo();

setInterval(logSystemInfo, 5000);