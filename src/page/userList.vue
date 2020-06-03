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
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="地区">
                            {{props.row.area}}
                        </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="编号"
                  prop="id">
                </el-table-column>
                <el-table-column
                  label="名称"
                  prop="name">
                </el-table-column>
                <el-table-column
                  label="签名"
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
                      @click="agreereview(scope.row.onlyid)">通过</el-button>
                  </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import headTop from "../components/headTop";
export default {
  data() {
    return {
      tableData: [],
      showtableData: [],
      searchselect: '',
      searchinput: '',
    };
  },
  created() {},
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
    async agreereview(inputonlyid) {

    },
    async cancelreview(inputonlyid) {

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
