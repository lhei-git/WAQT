FROM python:3.10-slim-buster
WORKDIR /back-end
# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .