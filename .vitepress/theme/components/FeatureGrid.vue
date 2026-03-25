<script setup>
import { ShoppingCart, Smartphone, Users, Repeat, QrCode } from 'lucide-vue-next'
</script>

<template>
  <div class="feature-grid">
    <div class="feature-item">
      <div class="feature-icon">
        <ShoppingCart :size="24" />
      </div>
      <h3>E-commerce Platforms</h3>
      <p>Accept payments for online stores</p>
    </div>

    <div class="feature-item">
      <div class="feature-icon">
        <Smartphone :size="24" />
      </div>
      <h3>Mobile Applications</h3>
      <p>Process in-app payments</p>
    </div>

    <div class="feature-item">
      <div class="feature-icon">
        <Users :size="24" />
      </div>
      <h3>Marketplaces</h3>
      <p>Handle payments between buyers and sellers</p>
    </div>

    <div class="feature-item">
      <div class="feature-icon">
        <Repeat :size="24" />
      </div>
      <h3>Subscription Services</h3>
      <p>Manage recurring billing</p>
    </div>

    <div class="feature-item">
      <div class="feature-icon">
        <QrCode :size="24" />
      </div>
      <h3>QR Code Payments</h3>
      <p>Generate payment QR codes for in-person transactions</p>
    </div>
  </div>
</template>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin: 32px 0;
}

.feature-item {
  padding: 24px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.feature-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-bottom: 16px;
  font-size: 24px;
}

.feature-item h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.feature-item p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
