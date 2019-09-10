<template>
  <div class="goods">
    <el-button @click="goodsadd" type="success" plain>添加商品</el-button>
    <el-table :data="goodList">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot:default="{row}">{{row.add_time | time}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="small"></el-button>
          <el-button
            @click="delgood(row.goods_id)"
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created () {
    this.getgoodList()
  },
  methods: {
    async getgoodList () {
      const { data, meta } = await this.$axios.get('goods', {
        params: { pagenum: this.pagenum, pagesize: this.pagesize }
      })
      console.log(data)
      if (meta.status === 200) {
        this.goodList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getgoodList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getgoodList()
    },
    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    },
    goodsadd () {
      this.$router.push('./goods-add')
    },
    async delgood (id) {
      console.log(id)
      const { meta } = await this.$axios.delete(`goods/${id}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getgoodList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
