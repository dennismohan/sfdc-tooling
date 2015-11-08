var watchFiles = '';

module.exports = function(grunt){
   require('load-grunt-tasks')(grunt);

	grunt.initConfig({
        watch: {
            classes: {
                files: ['build/pages/*.page', 'build/classes/*.cls'],
                tasks: ['exec:deploy'],
                options: {
                    spawn: false,
                },
            },
        },
        exec: {
            deploy: {
                cmd: function(){
                    var fn = this.config.get('exec.current_file');
                    return 'node app2.js ' + fn;
                },
            },
        },
	});

    grunt.event.on('watch', function(action, filepath){
        grunt.config('exec.current_file', filepath);
    });

    grunt.registerTask('default', ['watch']);
}
