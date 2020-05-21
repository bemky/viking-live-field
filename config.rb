# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions
set :source, 'docs-src'
set :build_dir, 'docs'

activate :condenser, prefix: '/viking-live-field' do |condenser_configs|
  condenser_configs.path = [
    'docs-assets/images',
    'docs-assets/stylesheets',
    'docs-assets/stylesheets/highlight',
    'docs-assets/javascripts',
    'node_modules/uniform-ui/lib/assets/stylesheets',
    'src'
  ]
end

helpers do
  def html_block(**args, &block)
    html = if handler = auto_find_proper_handler(&block)
      handler.capture_from_template(**args, &block)
    else
      yield(**args)
    end
    
    spaces = html.match(/^ +/)
    if spaces
      spaces = spaces[0]
      count = spaces.scan(/ /).count
      html = html.gsub(/^ {#{count}}/, "")
    end
    html = "<pre><code class='#{args[:type]}'>" + CGI::escapeHTML(html.strip)
    html = html + "</code></pre>"
    
    ::ActiveSupport::SafeBuffer.new.safe_concat(html)
  end
end