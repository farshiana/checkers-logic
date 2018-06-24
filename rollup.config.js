import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
	entry: 'src/index.js',
	dest: 'build/checkers-logic.min.js',
	format: 'umd',
	name: 'checkers-logic',
	plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        uglify(),
    ],
};
