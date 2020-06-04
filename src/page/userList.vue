<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div style="margin: 15px;">
      <el-input placeholder="搜索" v-model="searchinput" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="table_container">
      <el-table
        :data="showtableData"
        :row-key="row => row.id"
        style="width: 100%">
        <el-table-column
          label="编号"
          prop="id">
        </el-table-column>
        <el-table-column
          label="名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="个性签名"
          prop="introduce">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark">
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="agreereview(scope.row.onlyid)">修改</el-button>
            <el-button
              size="small"
              type="danger"
              @click="agreereview(scope.row.onlyid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      searchinput: ""
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
