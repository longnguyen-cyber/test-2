import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, formatEther, isAddress, parseEther } from 'ethers';

@Injectable()
export class Web3Service {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(Web3Service.name);
  private provider(): ethers.JsonRpcProvider {
    const provider = new ethers.JsonRpcProvider(this.configService.get<string>('WEB3_PROVIDER'));
    return provider;
  }

  async checkAddressCheckSum(address: string): Promise<boolean> {
    return isAddress(address);
  }
  async getBalance(address: string): Promise<string> {
    const provider = this.provider();
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  }
  async sendEtherWithCustomNode(receiverAddress: string, amount: string): Promise<void> {
    const senderPrivateKey = this.configService.get<string>('PRIVATE_KEY');
    const yourAddress = this.configService.get<string>('ADDRESS');

    const provider = this.provider(); // Sử dụng provider
    const wallet = new ethers.Wallet(senderPrivateKey as string, provider);

    try {
      // Kiểm tra số dư
      const balance = await provider.getBalance(yourAddress as string);
      this.logger.log(`Số dư hiện tại: ${formatEther(balance)} ETH`);

      if (balance < parseEther(amount)) {
        this.logger.error('Không đủ số dư để thực hiện giao dịch.');
        return;
      }

      // Tạo giao dịch
      const tx = {
        to: receiverAddress,
        value: parseEther(amount), // Số ETH muốn gửi
        gasLimit: 21000, // Gas limit cho giao dịch đơn giản
        gasPrice: (await provider.getFeeData()).gasPrice, // Lấy gas price từ node
      };

      // Gửi giao dịch
      this.logger.log('Đang gửi giao dịch...');
      const transaction = await wallet.sendTransaction(tx);

      this.logger.log('Đang chờ giao dịch được xác nhận...');
      const receipt = await transaction.wait(); // Đợi xác nhận giao dịch

      if (receipt) {
        this.logger.log(`Giao dịch thành công! Hash: ${receipt.hash}`);
      } else {
        this.logger.error('Giao dịch không thành công, receipt is null.');
      }
    } catch (error) {
      this.logger.error('Lỗi khi gửi giao dịch:', error);
    }
  }
}
