class VariableTextFormatter {
    private readonly baseText: string;
    private readonly variables: VariablesInterface;
    private readonly regex: RegExp = /\{(.*?)}/g;

    public constructor(baseText: string, variables: VariablesInterface) {
        this.baseText = baseText;
        this.variables = variables;
    }

    public getFormattedText = (): string => {
        let formattedText: string = this.baseText;
        let match: RegExpExecArray | null = null;
        while ((match = this.regex.exec(this.baseText)) !== null) {
            if (match.index === this.regex.lastIndex) {
                this.regex.lastIndex++;
            }
            const [varName, varValue] = match;
            formattedText = formattedText.replaceAll(varName, VariableTextFormatter.recursiveGetCorrespondingData(this.variables, varValue.split('.')));
        }

        return formattedText;
    }

    private static recursiveGetCorrespondingData = (data: VariablesInterface | string | undefined, variable: string[]): string => {
        if(typeof data === 'string') {
            return data;
        } else if (typeof data === 'undefined') {
            return '';
        } else {
            const [key, ...newVariable]: string[] = variable;
            return VariableTextFormatter.recursiveGetCorrespondingData(data[key], newVariable);
        }
    }
}

export interface VariablesInterface {
    [key: string]: VariablesInterface | string;
}

export default VariableTextFormatter;