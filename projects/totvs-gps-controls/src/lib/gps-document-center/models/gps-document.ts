/**
 * @description
 * Modelo de retorno do backend para os arquivos da central de documentos
 */
export class GpsDocument {
    date: Date;         // Data do arquivo (backend retorna no formato "2026/11/17 10:19:30")
    fullPath: string;   // Caminho completo do arquivo
    size: number;       // Tamanho em bytes
    name: string;       // Nome do arquivo
    type: string;       // Tipo (File, Directory...)

    typeLabel: string;  // Tipo para exibição
    sizeLabel: string;  // Tamanho formatado para exibição

    $actions: any;

    parseJsonToObject(data: any): GpsDocument {
        this.date = data.date ? new Date(String(data.date).replace(/-/g, '/')) : null;
        this.fullPath = data.fullPath;
        this.size = data.size;
        this.name = data.name;
        this.type = data.type;

        this.typeLabel = this.isFile ? 'Arquivo' : 'Pasta';
        this.sizeLabel = this.isFile ? GpsDocument.formatSize(data.size) : '';

        this.$actions = ['download'];

        return this;
    }

    get isFile(): boolean {
        return this.type === "File";
    }

    private static formatSize(bytes: number): string {
        if (bytes == null) {
            return '';
        }
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let value = bytes;
        let unit = 0;
        while (value >= 1024 && unit < units.length - 1) {
            value /= 1024;
            unit++;
        }
        const text = unit === 0 ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
        return `${text} ${units[unit]}`;
    }
}
