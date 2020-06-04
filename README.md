# edu_backstage

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 初始化数据库

```
create database book;
create table book(id int primary key auto_increment not null,name char(100) not null, introduce char(100), value int not null, remark char(100), statu int not null default 0, borrowuser char(100), borrowtime char(100));
create table user(id int primary key auto_increment not null,name char(100) not null unique, introduce char(100), remark char(100));
INSERT INTO user ( name ) VALUES ( '张三' );
INSERT INTO book ( name,value ) VALUES ( '飘',10 );
INSERT INTO book ( name,value ) VALUES ( '离散数学',10 );
INSERT INTO book ( name,value ) VALUES ( '书名一定要长长长长长',10 );
```
