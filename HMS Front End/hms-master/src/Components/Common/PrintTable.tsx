import React, { useEffect } from 'react';

const PrintTable = (props: any) => {
    useEffect(() => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            // Dynamically generate table headers
            const headers = Object.keys(props.item);
            const tableHead = headers
                .map(header => `<th>${header.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>`)
                .join('');
            
            // Dynamically generate table row based on item data
            const tableRow = headers
                .map(header => `<td>${props.item[header]}</td>`)
                .join('');
            
            const tableContent = `
                <table border="1" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>${tableHead}</tr>
                    </thead>
                    <tbody>
                        <tr>${tableRow}</tr>
                    </tbody>
                </table>
            `;

            printWindow.document.write(`
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                            th { background-color: #f8f9fa; }
                        </style>
                    </head>
                    <body onload="window.print(); window.close();">
                        ${tableContent}
                    </body>
                </html>
            `);
            printWindow.document.close();

            // Trigger onClose after the print dialog closes
            printWindow.onafterprint = () => props.onClose();
        } else {
            console.error("Failed to open print window.");
        }
    }, [props.item, props.onClose]); // Run only once, when component mounts

    return null; // No visible UI, as this component is only for printing
};

export default PrintTable;
