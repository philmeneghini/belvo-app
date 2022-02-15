FROM ruby:3.1

RUN gem install bundler:2.2.33

WORKDIR /opt/belvo

COPY Gemfile /opt/belvo/Gemfile
COPY Gemfile.lock /opt/belvo/Gemfile.lock
RUN bundle install

COPY . /opt/belvo

EXPOSE 5000

CMD ["ruby", "app.rb"]
