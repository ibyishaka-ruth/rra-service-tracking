package rw.rra.taxpayerservice.domain;

public record TaxpayerResponse(Long id, String tin) {

	public static TaxpayerResponse from(Taxpayer taxpayer) {
		return new TaxpayerResponse(taxpayer.getId(), taxpayer.getTin());
	}
}