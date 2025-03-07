FROM openjdk:17

WORKDIR /usrapp/bin

ENV PORT=8080

COPY /target/classes /usrapp/bin/target/classes
COPY /target/dependency /usrapp/bin/target/dependency

CMD ["java","-cp","./target/classes:./target/dependency/*","com.example.accessing_data_jpa.AccessingDataJpaApplication"]