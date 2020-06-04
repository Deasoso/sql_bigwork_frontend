<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div style="margin: 15px;">
      <el-input placeholder="搜索名称" v-model="searchinput" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>

    <el-button
      size="small"
      type="success"
      style="margin-left: 15px;"
      @click="newUserDialog = true">添加用户</el-button>

    <div class="table_container">
      <el-table
        :data="showtableData"
        :row-key="row => row.id"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="个性签名">
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
          label="用户名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="余额"
          prop="value">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark">
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="changeUserDialogOpen(scope.row)">修改信息</el-button>
            <el-button
              size="small"
              type="success"
              @click="buyUser(scope.row)">充值</el-button>
            <el-button
              size="small"
              type="warning"
              @click="sellUser(scope.row)">消费</el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加用户" :visible.sync="newUserDialog">
      <el-input placeholder="请输入内容" v-model="newUserName" style="margin:5px;">
        <template slot="prepend">用户名</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="newUserIntroduce" style="margin:5px;">
        <template slot="prepend">个性签名</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="newUserValue" style="margin:5px;">
        <template slot="prepend">初始余额</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="newUserRemark" style="margin:5px;">
        <template slot="prepend">备注</template>
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="newUser()">添 加</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加用户" :visible.sync="changeUserDialog">
      <el-input placeholder="请输入内容" v-model="changeUserName" style="margin:5px;">
        <template slot="prepend">用户名</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="changeUserIntroduce" style="margin:5px;">
        <template slot="prepend">个性签名</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="changeUserValue" style="margin:5px;">
        <template slot="prepend">余额</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="changeUserRemark" style="margin:5px;">
        <template slot="prepend">备注</template>
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeUser()">添 加</el-button>
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
      tableData: [],
      showtableData: [],
      searchinput: "",

      newUserDialog: false,
      newUserName: '',
      newUserIntroduce: '',
      newUserValue: 0,
      newUserRemark: '',

      changeUserId: 0,
      changeUserDialog: false,
      changeUserName: '',
      changeUserIntroduce: '',
      changeUserValue: 0,
      changeUserRemark: ''
    };
  },
  beforeRouteEnter (to, from, next) {
    // 进入页面时执行一次
    next(async vm => {
      const k = await api.query('select * from user');
      vm.tableData = k.data.data;
      vm.showtableData = k.data.data;
    });
  },
  computed: {},
  components: {
    headTop
  },
  methods: {
    async initData() {
      const k = await api.query('select * from user');
      this.tableData = k.data.data;
      this.showtableData = this.tableData;
    },
    async newUser() {
      const sql = "INSERT INTO user ( name,introduce,value,remark ) " + 
        "VALUES ( '" + this.newUserName + "'," 
        + "'" + this.newUserIntroduce + "'," 
        + this.newUserValue + ","
        + "'" + this.newUserRemark + "' );";
      const k = await api.query(sql);
      if(k.data.code == 200) this.initData();
      this.newUserDialog = false;
    },
    changeUserDialogOpen(user){
      this.changeUserName = user.name;
      this.changeUserIntroduce = user.introduce;
      this.changeUserValue = user.value;
      this.changeUserRemark = user.remark;
      this.changeUserDialog = true;
      this.changeUserId = user.id;
    },
    async changeUser(){
      const sql = "UPDATE user SET " + 
        "name='"+ this.changeUserName + "'," + 
        "introduce='"+ this.changeUserIntroduce + "'," +
        "value="+ this.changeUserValue + "," +
        "remark='"+ this.changeUserRemark + "' " +
        "WHERE id=" + this.changeUserId;
      const k = await api.query(sql);
      if(k.data.code == 200) this.initData();
      this.changeUserDialog = false;
    },
    async buyUser(user){
      this.$prompt('请输入充值金额', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({ value }) => {
          const sql = "UPDATE user SET " + 
            "value=value+" + value + " " +
            "WHERE id=" + user.id;
          const k = await api.query(sql);
          if(k.data.code == 200) this.initData();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    async sellUser(user){
      this.$prompt('请输入消费金额', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({ value }) => {
          const sql = "UPDATE user SET " + 
            "value=value-" + value + " " +
            "WHERE id=" + user.id;
          const k = await api.query(sql);
          if(k.data.code == 200) this.initData();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    async deleteUser(user){
      const sure = await new Promise((resolve, reject) => {
        this.$msgbox({
          title: "提示",
          message: "确认删除用户吗？",
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
      const sql = "DELETE FROM user " + 
        "WHERE id=" + user.id;
      const k = await api.query(sql);
      if(k.data.code == 200) this.initData();
    },
    search(){
      this.showtableData = this.showtableData.filter(
        item => item.name.indexOf(this.searchinput) != -1
      );
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
