import typescript from 'rollup-plugin-typescript2'
import versionInjector from 'rollup-plugin-version-injector'

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'build/hexview.js',
            name: 'hexview',
            format: 'umd',
            
        },
        
        plugins: [
            typescript(),
            versionInjector(),
        ],
    }
]
