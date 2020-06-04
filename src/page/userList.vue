<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div style="margin: 15px;">
      <el-input placeholder="搜索名称" v-model="searchinput" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
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
              @click="agreereview(scope.row.onlyid)">修改信息</el-button>
            <el-button
              size="small"
              type="success"
              @click="agreereview(scope.row.onlyid)">充值</el-button>
            <el-button
              size="small"
              type="warning"
              @click="agreereview(scope.row.onlyid)">消费</el-button>
            <el-button
              size="small"
              type="danger"
              @click="agreereview(scope.row.onlyid)">删除</el-button>
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
        <el-button type="primary" @click="login()">添 加</el-button>
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
      searchselect: "",
      searchinput: "",

      newUserDialog: false,
      newUserName: '',
      newUserIntroduce: '',
      newUserValue: '',
      newUserRemark: ''
    };
  },
  beforeRouteEnter (to, from, next) {
    // 进入页面时执行一次
    next(async vm => {
      const k = await api.query('select * from user');
      vm.showtableData = k.data.data;
    });
  },
  // async beforeRouteEnter() {
  //   console.log('created');
  //   const k = await api.query('select * from user');
  //   this.showtableData = k.data.data;
  //   console.log(k.data.data[0].name);
  // },
  computed: {},
  components: {
    headTop
  },
  methods: {
    async initData() {
      await this.getReviews();
      this.Clicktab({ name: this.activeName });
    },
    async getReviews() {
      const _this = this;
    },
    async agreereview(inputonlyid) {},
    async cancelreview(inputonlyid) {}
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
