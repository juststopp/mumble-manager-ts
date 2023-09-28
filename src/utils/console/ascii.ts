import chalk from 'chalk'
import { version, author, homepage } from '../../../package.json';

console.log(chalk.blue.bold('[MUMBLES]') + chalk.cyan(` Lancement du bot en cours.\n`))
console.log(chalk.blue.bold('[MUMBLES]') + chalk.cyan(` Version: ${version}`));
console.log(chalk.blue.bold('[MUMBLES]') + chalk.cyan(` Author: ${author}`));
console.log(chalk.blue.bold('[MUMBLES]') + chalk.cyan(` Github: ${homepage}\n`));