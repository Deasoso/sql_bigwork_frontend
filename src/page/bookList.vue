<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div style="margin: 15px;">
      <el-input placeholder="搜索" v-model="searchinput" class="input-with-select" @click="search">
        <el-select v-model="searchselect" slot="prepend" placeholder="请选择">
          <el-option label="书名" value="书名"></el-option>
          <el-option label="id" value="id"></el-option>
          <el-option label="用户名" value="用户名"></el-option>
        </el-select>
        <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
      </el-input>
    </div>

    <el-button
      size="small"
      type="success"
      style="margin-left: 15px;margin-bottom: 15px;"
      @click="newBookDialog = true">添加图书</el-button>
    <el-button
      size="small"
      type="danger"
      style="margin-left: 15px;margin-bottom: 15px;"
      @click="sellBookDialog = true">批量售出</el-button>

    <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
      <el-tab-pane label="在架" name="normal"></el-tab-pane>
      <el-tab-pane label="已借出" name="borrow"></el-tab-pane>
      <el-tab-pane label="已售出" name="sell"></el-tab-pane>
      <el-tab-pane label="所有图书" name="all"></el-tab-pane>
    </el-tabs>
    <div class="table_container">
      <el-table
        :data="showtableData"
        :row-key="row => row.id"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="介绍">
                {{props.row.introduce}}
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
          prop="id">
        </el-table-column>
        <el-table-column
          label="书名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="价格"
          prop="value">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="statu">
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="borrowBook(scope.row)">借出</el-button>
            <el-button
              size="small"
              type="success"
              @click="backBook(scope.row)">归还</el-button>
            <el-button
              size="small"
              type="warning"
              @click="openChangeBookDialog(scope.row)">修改</el-button>
            <el-button
              size="small"
              type="danger"
              @click="sellBook(scope.row)">售出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加图书" :visible.sync="newBookDialog">
      <el-input placeholder="请输入内容" v-model="newBookName" style="margin:5px;">
        <template slot="prepend">书名</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="newBookIntroduce" style="margin:5px;">
        <template slot="prepend">介绍</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="newBookValue" style="margin:5px;">
        <template slot="prepend">价格</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="newBookRemark" style="margin:5px;">
        <template slot="prepend">备注</template>
      </el-input>
      <span style="margin-left:5px;margin-right:10px;">添加数量</span>
      <el-input-number style="margin:5px;" v-model="newBookCount" :min="1" :max="99999" label="添加数量"></el-input-number>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newBookDialog = false">取 消</el-button>
        <el-button type="primary" @click="newBook()">添 加</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改图书" :visible.sync="changeBookDialog">
      <el-input placeholder="请输入内容" v-model="changeBookName" style="margin:5px;">
        <template slot="prepend">书名</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="changeBookIntroduce" style="margin:5px;">
        <template slot="prepend">介绍</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="changeBookValue" style="margin:5px;">
        <template slot="prepend">价格</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="changeBookRemark" style="margin:5px;">
        <template slot="prepend">备注</template>
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeBookDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeBook()">修 改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量售出" :visible.sync="sellBookDialog">
      <el-input style="width:40%;" v-model="startid" placeholder="起始id"></el-input> -
      <el-input style="width:40%;" v-model="endid" placeholder="结束id"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sellBookDialog = false">取 消</el-button>
        <el-button type="primary" @click="sellManyBook()">出 售</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import api from "../api";

export default {
  data() {
    return {
      activeName: "normal",
      tableData: [],
      showtableData: [],
      headertoken: "",
      searchselect: '',
      searchinput: '',

      // 添加图书
      newBookDialog: false,
      newBookName: '',
      newBookIntroduce: '',
      newBookValue: '',
      newBookRemark: '',
      newBookCount: 1,

      // 修改图书
      changeBookId: 0,
      changeBookDialog: false,
      changeBookName: '',
      changeBookIntroduce: '',
      changeBookValue: '',
      changeBookRemark: '',

      // 批量售出
      sellBookDialog: false,
      startid: '',
      endid: '',
    };
  },
  created() {},
  computed: {},
  components: {
    headTop
  },
  beforeRouteEnter (to, from, next) {
    // 进入页面时执行一次
    next(async vm => {
      const k = await api.query('select * from book');
      console.log(k);
      vm.tableData = k.data.data;
      vm.showtableData = k.data.data;
      if (vm.activeName == "all") {
        vm.showtableData = vm.tableData;
      } else if (vm.activeName == "normal") {
        vm.showtableData = vm.tableData.filter(item => item.statu === '在架');
      } else if (vm.activeName == "borrow") {
        vm.showtableData = vm.tableData.filter(item => item.statu === '已借出');
      } else if (vm.activeName == "sell") {
        vm.showtableData = vm.tableData.filter(item => item.statu === '已售出');
      }
    });
  },
  methods: {
    Clicktab(e) {
      this.activeName = e.name;
      console.log(e.name);
      if (e.name == "all") {
        this.showtableData = this.tableData;
      } else if (e.name == "normal") {
        this.showtableData = this.tableData.filter(item => item.statu === '在架');
      } else if (e.name == "borrow") {
        this.showtableData = this.tableData.filter(item => item.statu === '已借出');
      } else if (e.name == "sell") {
        this.showtableData = this.tableData.filter(item => item.statu === '已售出');
      }
    },
    async initData() {
      const k = await api.query('select * from book');
      this.tableData = k.data.data;
      this.showtableData = k.data.data;
      this.Clicktab({ name: this.activeName });
    },
    openChangeBookDialog(book){
      this.changeBookName = book.name;
      this.changeBookIntroduce = book.introduce;
      this.changeBookValue = book.value;
      this.changeBookRemark = book.remark;
      this.changeBookId = book.id;
      this.changeBookDialog = true;
    },
    async newBook() {
      for(var i=0;i<this.newBookCount;i++){
        const sql = "INSERT INTO book ( name,introduce,value,remark ) " + 
          "VALUES ( '" + this.newBookName + "'," 
          + "'" + this.newBookIntroduce + "'," 
          + this.newBookValue + ","
          + "'" + this.newBookRemark + "' );";
        const k = await api.silentquery(sql);
      }
      this.$message("完毕");
      this.initData();
      this.newBookDialog = false;
    },
    async changeBook(){
      const sql = "UPDATE book SET " + 
        "name='"+ this.changeBookName + "'," + 
        "introduce='"+ this.changeBookIntroduce + "'," +
        "value="+ this.changeBookValue + "," +
        "remark='"+ this.changeBookRemark + "' " +
        "WHERE id=" + this.changeBookId;
      const k = await api.query(sql);
      if(k.data.code == 200) this.initData();
      this.changeBookDialog = false;
    },
    async borrowBook(book){
      this.$prompt('请输入借书人', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({ value }) => {
          const sql = "UPDATE book SET " + 
            "statu='"+ '已借出' + "'," + 
            "borrowtime='"+ this.gettime() + "'," + 
            "borrowuser='" + value + "' " +
            "WHERE id=" + book.id;
          const k = await api.query(sql);
          if(k.data.code == 200) this.initData();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    async sellBook(book){
      const sure = await new Promise((resolve, reject) => {
        this.$msgbox({
          title: "提示",
          dangerouslyUseHTMLString: true,
          message: "确认要售出吗？",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              done();
              resolve(true);
            } else {
              done();
              resolve(false);
            }
          }
        });
      });
      if (!sure) return;
      const sql = "UPDATE book SET " + 
        "statu='"+ "已售出" + "' " + 
        "WHERE id=" + book.id;
      const k = await api.query(sql);
      if(k.data.code == 200) this.initData();
    },
    async sellManyBook(book){
      const sure = await new Promise((resolve, reject) => {
        this.$msgbox({
          title: "提示",
          dangerouslyUseHTMLString: true,
          message: "确认要批量售出吗？",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              done();
              resolve(true);
            } else {
              done();
              resolve(false);
            }
          }
        });
      });
      if (!sure) return;
      for(var i=this.startid;i<=this.endid;i++){
        const sql = "UPDATE book SET " + 
          "statu='"+ "已售出" + "' " + 
          "WHERE id=" + i;
        const k = await api.silentquery(sql);
      }
      this.$message("完毕");
      this.initData();
      this.sellBookDialog = false;
    },
    async backBook(book){
      const sure = await new Promise((resolve, reject) => {
        this.$msgbox({
          title: "提示",
          dangerouslyUseHTMLString: true,
          message: "<div>借书日期：" + book.borrowtime + "</div>" + 
            "<div>借书人：" + book.borrowuser + "</div>" + 
            "<div>确认要还书吗？</div>",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              done();
              resolve(true);
            } else {
              done();
              resolve(false);
            }
          }
        });
      });
      if (!sure) return;
      const sql = "UPDATE book SET " + 
        "statu='"+ '在架' + "'," + 
        "borrowtime='"+ " " + "'," + 
        "borrowuser='" + " " + "' " +
        "WHERE id=" + book.id;
      const k = await api.query(sql);
      if(k.data.code == 200) this.initData();
    },
    search(){
      if(this.searchinput == ''){
        this.Clicktab({ name: this.activeName });
        return;
      } 
      if(this.searchselect == '书名'){
        this.showtableData = this.showtableData.filter(
          item => item.name.indexOf(this.searchinput) != -1
        );
      }else if(this.searchselect == 'id'){
        this.showtableData = this.showtableData.filter(
          item => item.id == this.searchinput
        );
      }else if(this.searchselect == '用户名'){
        this.showtableData = this.showtableData.filter(
          item => item.borrowuser.indexOf(this.searchinput) != -1
        );
      }
      
    },
    gettime(){
      var date=new Date();
      var year=date.getFullYear(); //获取当前年份
      var mon=date.getMonth()+1; //获取当前月份
      var day=date.getDate(); //获取当前日
      var h=date.getHours(); //获取小时
      var m=date.getMinutes(); //获取分钟
      var s=date.getSeconds(); //获取秒
      return year+'年'+mon+'月'+day+'日'+' '+h+':'+m+':'+s;
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
